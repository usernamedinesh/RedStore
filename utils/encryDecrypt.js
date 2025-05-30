// worker.js
const { parentPort } = require("worker_threads");

const enc = new TextEncoder();
const dec = new TextDecoder();

function toBase64(bytes) {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // remove padding
}

function fromBase64(str) {
  // Add padding back
  const padLength = 4 - (str.length % 4);
  const base64 =
    str.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat(padLength === 4 ? 0 : padLength);
  return Uint8Array.from(Buffer.from(base64, "base64"));
}

async function deriveKey(password, salt) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

const encryptString = async (plaintext, password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(plaintext),
    ),
  );
  return `${toBase64(salt)}.${toBase64(iv)}.${toBase64(ciphertext)}`;
};

const decryptString = async (encryptedStr, password) => {
  try {
    const [saltB64, ivB64, ciphertextB64] = encryptedStr.split(".");
    const salt = fromBase64(saltB64);
    const iv = fromBase64(ivB64);
    const ciphertext = fromBase64(ciphertextB64);
    const key = await deriveKey(password, salt);
    const plainBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );
    return dec.decode(plainBuf);
  } catch (err) {
    return "__DECRYPTION_FAILED__";
  }
};

parentPort.on("message", async (msg) => {
  const { action, data, password } = msg;
  if (action === "encrypt") {
    const result = await encryptString(data, password);
    parentPort.postMessage({ success: true, result });
  } else if (action === "decrypt") {
    const result = await decryptString(data, password);
    parentPort.postMessage({
      success: result !== "__DECRYPTION_FAILED__",
      result,
    });
  }
});
