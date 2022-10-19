import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LoadingScreen from "./components/LoadingScreen";
import FooterComponent from "./components/FooterComponent";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { ModelListener, } from "./inference/predict";
import { RecoilRoot, atom, useRecoilValue } from "recoil";
import AppScreen from "./components/AppScreen";

export const modelLoadedState = atom({
    key: "modelLoaded",
    default: false,
});

function Layout() {
    const loaded = useRecoilValue(modelLoadedState);

    return (
        <React.StrictMode>
            {!loaded ? <LoadingScreen /> : <AppScreen />}
            <FooterComponent />
        </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <RecoilRoot>
        <Layout />
        <ModelListener />
    </RecoilRoot>
);

// Use a service worker: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
