import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LoadingScreen from "./components/LoadingScreen";
import FooterComponent from "./components/FooterComponent";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import {tokenize, detokenize} from "./inference/tokenizer"
import predict from "./inference/predict"

let page_loaded = false

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {!page_loaded ? <LoadingScreen /> : ""}
    <FooterComponent />
  </React.StrictMode>
);

console.log(tokenize("Hi!"));

// Use a service worker: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
