const { Worker } = require("worker_threads");
const path = require("path");

const runCryptoTask = (action, data, password) => {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, "../utils/encryDecrypt.js"); // relative path to worker.js
    const worker = new Worker(workerPath);

    worker.postMessage({ action, data, password });

    worker.on("message", (msg) => {
      if (msg.success) {
        resolve(msg.result);
      } else {
        reject(new Error("Crypto operation failed"));
      }
      worker.terminate();
    });

    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
    });
  });
};

// Example usage
// (async () => {
//   const password = "two";
//   const plaintext = "one";
//
//   const encrypted = await runCryptoTask("encrypt", plaintext, password);
//   console.log("Encrypted:", encrypted);
//
//   const decrypted = await runCryptoTask("decrypt", encrypted, password);
//   console.log("Decrypted:", decrypted);
// })();

module.exports = runCryptoTask;
