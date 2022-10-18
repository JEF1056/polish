const model_worker = new Worker("static/js/model_worker.js");
warmed_up = false
let warmup_prompt = "How do you spell"

fetch('/static/midnightquotes.txt').then(response => response.text()).then((data) => {
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
	message = event.data;
    switch (message["type"]) {
        case 'info':
            switch (message["details"]) {
                case 'loaded':
                    set_warmup(warmup_prompt + " ...")
                    predict("warmup", "complete: " + warmup_prompt)
                    break
                case 'loading':
                    set_progress(message["progress"], false)
                    break
            }
            break
        case 'work':
            if (!warmed_up) {
                detokenized = detokenize(message['tokens'])
                set_warmup(warmup_prompt + (detokenized.startsWith(" ") ? detokenized : " " + detokenized))
            } else if (message['id'] == "complete") {
                completion_buffer = detokenize(message['tokens'])
                update_text_from_buffers()
            } else if (message['id'] == "improve") {
                improvement_buffer = detokenize(message['tokens'])
                update_text_from_buffers()
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