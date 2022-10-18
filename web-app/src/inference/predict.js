import React from "react"
import {tokenize, detokenize} from "./inference/tokenizer"

const model_worker = new Worker("static/js/model_worker.js");
let warmed_up = false
let warmup_prompt = "How do you spell"

fetch('/midnightquotes.txt').then(response => response.text()).then((data) => {
    if (data) {
        warmup_prompt = data.split('\n').sample()
    }
}).catch(err => console.error(err));

function predict(id, input) {
    // Model worker accepts UUID and message id
    model_worker.postMessage([
        id,
        tokenize(input),
    ])
    console.log("input", input)
}

model_worker.addEventListener("message", (event) => {
	let message = event.data;
    switch (message["type"]) {
        case 'info':
            switch (message["details"]) {
                case 'loaded':
                    warmup = warmup_prompt;
                    break
                case 'loading':
                    set_progress(message["progress"], false)
                    break
            }
            break
        case 'work':
            if (!warmed_up) {
                let detokenized = detokenize(message['tokens'])
                set_warmup(warmup_prompt + (detokenized.startsWith(" ") ? detokenized : " " + detokenized))
            }
            break
        case 'done':
            if (!warmed_up) {
                warmed_up = true
                set_progress(message["time"], warmed_up)
            }
            break
    }
});

export default predict