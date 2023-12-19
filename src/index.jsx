/* global document */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./zip-manager/ZipManager.jsx";

import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducer/index";
const store = createStore(rootReducer);

const root = ReactDOM.createRoot(document.body);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);