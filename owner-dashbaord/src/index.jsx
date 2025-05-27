import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";

import { Header } from "./components/Header.jsx";
import { Home } from "./pages/Home/index.jsx";
import { NotFound } from "./pages/_404.jsx";
import "./style.css";
// import VerifyPage from "./components/VerifyPage.jsx";
import { Me } from "./components/Me.jsx";
import { ContextProvider } from "./customComponents/context.jsx";

export function App() {
  return (
    <LocationProvider>
      <Header />
      <ContextProvider>
        <main>
          <Router>
            <Route path="/verify/" component={Home} />
            {/* <Route path="/verify/" component={VerifyPage} /> */}
            <Route path="/me" component={Me} />
            <Route default component={NotFound} />
          </Router>
        </main>
      </ContextProvider>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
