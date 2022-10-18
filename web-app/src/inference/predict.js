import { tokenize, detokenize } from "./tokenizer";
import { useRecoilState } from "recoil";
import {
    loadingProgressState,
    loadingWarmupState,
} from "../components/LoadingScreen";
import { modelLoadedState } from "../index";

const model_worker = new Worker("/model_worker.js");

let warmup_prompt = "How do you spell";
let warmup_started = false;

fetch("/midnightquotes.txt")
    .then((response) => response.text())
    .then((data) => {
        if (data) {
            warmup_prompt = data.split("\n");
            warmup_prompt =
                warmup_prompt[Math.floor(Math.random() * warmup_prompt.length)];
        }
    })
    .catch((err) => console.error(err));

function predict(id, input) {
    // Model worker accepts UUID and message id
    model_worker.postMessage([id, tokenize(input)]);
    console.log("input", input);
}

function ModelListener() {
    const [progress, setLoadingProgress] = useRecoilState(loadingProgressState);
    const [warmup, setLoadingWarmup] = useRecoilState(loadingWarmupState);
    const [modelLoaded, setModelLoaded] = useRecoilState(modelLoadedState);

    model_worker.addEventListener("message", (event) => {
        let message = event.data;

        switch (message["type"]) {
            case "info":
                switch (message["details"]) {
                    case "loaded":
                        setLoadingWarmup(warmup_prompt + " ...");
                        break;
                    case "loading":
                        setLoadingProgress(message["progress"] * 90);
                        if (message["progress"] === 1 && !warmup_started) {
                            predict("warmup", warmup_prompt);
                            warmup_started = true;
                        }
                        break;
                }
                break;
            case "work":
                if (!modelLoaded) {
                    let detokenized = detokenize(message["tokens"]);
                    console.log(detokenized);
                    setLoadingWarmup(
                        warmup_prompt +
                            (detokenized.startsWith(" ")
                                ? detokenized
                                : " " + detokenized)
                    );
                }
                break;
            case "done":
                if (!modelLoaded) {
                    setTimeout(() => setModelLoaded(true), 2000);
                    setLoadingProgress(100);
                }
                break;
        }
    });
}

export { ModelListener, predict };
