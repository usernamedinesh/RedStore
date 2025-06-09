import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";

import { Header } from "./components/Header.jsx";
import { Home } from "./pages/Home/index.jsx";
import { Chat } from "./components/Chat";
import { NotFound } from "./pages/_404.jsx";
import "./style.css";
// import VerifyPage from "./components/VerifyPage.jsx";
import { Me } from "./components/Me.jsx";
import { ContextProvider } from "./customComponents/context.jsx";
import { Product } from "./components/Product.jsx";
import { SocketProvider } from "./customComponents/socketContext.jsx";

export function App() {
  return (
    <LocationProvider>
      <Header />
      <ContextProvider>
        <SocketProvider>
          <main>
            <Router>
              <Route path="/verify/" component={Home} />
              {/* <Route path="/verify/" component={VerifyPage} /> */}

              <Route path="/product" component={Product} />
              <Route path="/me" component={Me} />
              <Route path="/chat" component={Chat} />
              <Route default component={NotFound} />
            </Router>
          </main>
        </SocketProvider>
      </ContextProvider>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
