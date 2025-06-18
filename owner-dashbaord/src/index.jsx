import { render } from "preact";
import { LocationProvider, Router, Route, useLocation } from "preact-iso";

import { Header } from "./components/Header.jsx";
import { Home } from "./pages/Home/index.jsx";
import { Chat } from "./components/Chat";
import { NotFound } from "./pages/_404.jsx";
import { Hi } from "./components/Hi";
import "./style.css";
import { Me } from "./components/Me.jsx";
import { ContextProvider } from "./customComponents/context.jsx";
import { Product } from "./components/Product.jsx";
import { SocketProvider } from "./customComponents/socketContext.jsx";

function AppContent() {
  const { path } = useLocation();
  const hideHeaderOn = ["/404", "*"];
  const hideHeader = hideHeaderOn.includes(path);

  return (
    <>
      {!hideHeader && <Header />}
      <ContextProvider>
        <SocketProvider>
          <main>
            <Router>
              <Route path="/admin/" component={Home} />
              <Route path="/admin/verify/" component={Home} />
              <Route path="/admin/product" component={Product} />
              <Route path="/admin/me" component={Me} />
              <Route path="/admin/chat" component={Chat} />
              <Route default component={NotFound} />
            </Router>
          </main>
        </SocketProvider>
      </ContextProvider>
    </>
  );
}

export function App() {
  return (
    <LocationProvider>
      <AppContent />
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
