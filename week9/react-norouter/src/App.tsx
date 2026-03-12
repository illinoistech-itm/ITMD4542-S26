import { useState } from "react";
import "./App.css";
import HomePage from "./components/HomePage";
import HtmlPage from "./components/HtmlPage";
import CssPage from "./components/CssPage";
import JavaScriptPage from "./components/JavaScriptPage";

function App() {
  const [page, setPage] = useState("HomePage");

  let currentPage;

  switch (page) {
    case "HomePage":
      currentPage = <HomePage />;
      break;
    case "HtmlPage":
      currentPage = <HtmlPage />;
      break;
    case "CssPage":
      currentPage = <CssPage />;
      break;
    case "JavaScriptPage":
      currentPage = <JavaScriptPage />;
      break;
    default:
      currentPage = <HomePage />;
  }

  return (
    <div className="App">
      <header>
        <div className="site-name">An Introduction to Web Technologies</div>
      </header>
      <nav>
        <ul>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                setPage("HomePage");
              }}
              href=""
            >
              Welcome
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                setPage("HtmlPage");
              }}
              href=""
            >
              HTML
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                setPage("CssPage");
              }}
              href=""
            >
              CSS
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                setPage("JavaScriptPage");
              }}
              href=""
            >
              JavaScript
            </a>
          </li>
        </ul>
      </nav>
      <div className="content">{currentPage}</div>
    </div>
  );
}

export default App;
