import React from "react";
// import { BrowserRouter as Router } from 'react-router-dom';

import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

// React 18 ile aşağıdaki gibi render edilmesi gerekiyor
import ReactDOM from "react-dom/client";

// let history = createBrowserHistory();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //   <Router>
  <App />
  //   </Router>,
);

registerServiceWorker();
