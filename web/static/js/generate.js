const model_worker = new Worker("static/js/model_worker.js");
let warmed_up = false


function predict(input) {
    // Model worker accepts UUID and message id
    model_worker.postMessage([
        "69420",
        tokenize(input),
    ])
}

model_worker.addEventListener("message", (event) => {
	message = event.data;
    switch (message["type"]) {
        case 'info':
            switch (message["details"]) {
                case 'loaded':
                    set_warmup("Preparing to warm up ...")
                    predict("complete: That's good, that's fine, it's")
                    break
                case 'loading':
                    set_progress(message["progress"], false)
                    break
            }
            break
        case 'work':
            set_warmup(detokenize(message['tokens']))
            break
        case 'done':
            if (!warmed_up) {
                warmed_up = true
                set_progress(message["time"], warmed_up)
            }
            break
    }
});