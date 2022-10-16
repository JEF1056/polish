const model_worker = new Worker("static/js/model_worker.js");

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
                    // init_entries();
                    break
                case 'loading':
                    // set_progress(message["progress"])
                    console.log(message["progress"])
                    break
            }
            break
        case 'work':
            console.log(detokenize(message['tokens']))
            break
        case 'done':
            // timestamp_entry(message["id"], message["time"])
            console.log(message["id"], message["time"])
            break
    }
});