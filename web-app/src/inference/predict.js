import { tokenize, detokenize } from "./tokenizer";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    loadingProgressState,
    loadingWarmupState,
} from "../components/LoadingScreen";
import { continueTextState } from "../components/AppScreen";
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
    model_worker.postMessage([id, tokenize(input.trim())]);
    console.log("input", input);
}

function ModelListener() {
    const [continueText, setContinueText] = useRecoilState(continueTextState);

    const setLoadingProgress = useSetRecoilState(loadingProgressState);
    const setLoadingWarmup = useSetRecoilState(loadingWarmupState);
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
                            predict("warmup", "complete: " + warmup_prompt);
                            warmup_started = true;
                        }
                        break;
                    default:
                }
                break;
            case "work":
                if (!modelLoaded) {
                    let detokenized = detokenize(message["tokens"]);
                    switch (message["id"]) {
                        case "continue":
                            setContinueText(
                                detokenized.startsWith(" ")
                                    ? detokenized
                                    : " " + detokenized
                            );
                            console.log(continueText);
                            break;
                        case "warmup":
                            setLoadingWarmup(
                                warmup_prompt +
                                    (detokenized.startsWith(" ")
                                        ? detokenized
                                        : " " + detokenized)
                            );
                            break;
                        default:
                    }
                }
                break;
            case "done":
                if (!modelLoaded) {
                    setTimeout(() => setModelLoaded(true), 2000);
                    setLoadingProgress(100);
                }
                break;
            default:
        }
    });
}

export { ModelListener, predict };
