import { useLocation } from "preact-iso";

export function Header() {
  const { url } = useLocation();

  return (
    <header>
      <nav>
        <a href="/admin/verify/" class={url == "/admin/verify/" && "active"}>
          Home
        </a>

        <a href="/admin/me" class={url == "/admin/me" && "active"}>
          ME
        </a>

        <a href="/admin/chat" class={url == "/admin/product" && "active"}>
          Chat
        </a>
        <a href="/admin/product" class={url == "/admin/product" && "active"}>
          Product
        </a>
      </nav>
    </header>
  );
}
