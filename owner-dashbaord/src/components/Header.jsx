import { useLocation } from "preact-iso";

export function Header() {
  const { url } = useLocation();

  return (
    <header>
      <nav>
        <a href="/verify/" class={url == "/verify/" && "active"}>
          Home
        </a>

        <a href="/me" class={url == "/me" && "active"}>
          ME
        </a>
      </nav>
    </header>
  );
}
