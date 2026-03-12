import "./App.css";
import HomePage from "./components/HomePage";
import HtmlPage from "./components/HtmlPage";
import CssPage from "./components/CssPage";
import JavaScriptPage from "./components/JavaScriptPage";
import { NavLink, Route, BrowserRouter as Router, Routes } from "react-router";
import ReactTopic from "./components/ReactTopic";
import Es6Topic from "./components/Es6Topic";
import Topic from "./components/Topic";

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <div className="site-name">An Introduction to Web Technologies</div>
        </header>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Welcome</NavLink>
            </li>
            <li>
              <NavLink to="/html">HTML</NavLink>
            </li>
            <li>
              <NavLink to="/css">CSS</NavLink>
            </li>
            <li>
              <NavLink to="/js">JavaScript</NavLink>
            </li>
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/html" element={<HtmlPage />} />
            <Route path="/css" element={<CssPage />} />
            <Route path="/js" element={<JavaScriptPage />}>
              <Route path="react" element={<ReactTopic />} />
              <Route path="es6" element={<Es6Topic />} />
              <Route path=":topic" element={<Topic />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
