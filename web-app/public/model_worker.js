// This scripts runs async of the main render loop

importScripts(
    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.20.0/dist/tf.min.js"
);

const max_len = 64;
let model = null;
let temperature = 0.9;
let top_k = 10;

function top_k_top_p_filtering(logits, top_k, top_p) {
    // top_k refers to the top k highest values in the logits.
    // It needs to be done before top_p, since the probability distribution will be different once there are only k values.
    // Also massive yolo moment but top_p is too painful for my sleep-deprived brain so uhh top-k will have to do
    if (top_k > 0) {
        counter = 0;
        const buffer = tf.buffer(logits.shape, logits.dtype, logits.dataSync());
        const { values, _ } = tf.topk(logits, top_k);
        above_min = tf.min(values).dataSync();
        for (let t = 0; t < logits.shape[0]; t++) {
            if (buffer.get(t) < above_min) {
                buffer.set(Number.NEGATIVE_INFINITY, t);
            } else {
                counter += 1;
            }
        }

        logits = buffer.toTensor();
    }

    return logits;
}

function generate(event) {
    var [id, input_ids] = event.data;
    console.log(id);

    // take input_ids array, add a bach dimension, and pad to length
    // create attention mask, which is 1s for any actual value and 0s for padding
    _input_ids = tf.tensor2d([input_ids], null, "int32").pad([
        [0, 0],
        [0, max_len - input_ids.length],
    ]);
    _attention_mask = tf.ones([1, input_ids.length], "int32").pad([
        [0, 0],
        [0, max_len - input_ids.length],
    ]);

    // decoder starts with a single pad as an initialization token
    // we'll generate its attention mask and padding on the fly
    decoder_input_ids = [0];

    var startTime = performance.now();
    while (decoder_input_ids.length < 100) {
        // dynamically generate padding and attention mask
        _decoder_input_ids = tf
            .tensor2d([decoder_input_ids], null, "int32")
            .pad([
                [0, 0],
                [0, max_len - decoder_input_ids.length],
            ]);
        _decoder_attention_mask = tf
            .ones([1, decoder_input_ids.length], "int32")
            .pad([
                [0, 0],
                [0, max_len - decoder_input_ids.length],
            ]);

        // run model logit generation
        const _logits = tf.tidy(() =>
            model.execute({
                input_ids: _input_ids,
                attention_mask: _attention_mask,
                decoder_input_ids: _decoder_input_ids,
                decoder_attention_mask: _decoder_attention_mask,
            })
        );
        // model may randomly order the past_key_values, logits, and something else, so let's grab only the logits
        for (let i = 0; i < _logits.length; i++) {
            if (_logits[i].shape[2] === 32128) {
                logits = _logits[i];
                break;
            }
        }

        const preds = tf
            .slice(
                logits,
                [0, decoder_input_ids.length - 1, 0],
                [1, 1, logits.shape[2]]
            )
            .squeeze()
            .div(temperature); // Take logits, slice to only the layer for the next value and apply temperature; lower temperature = bigger disparity between values, larger temperature = smaller disparity between values
        const filtered = tf.tidy(() => top_k_top_p_filtering(preds, top_k)); // filter values by top_k and top_p
        const softmax = tf.tidy(() => tf.softmax(filtered, (dim = -1))); // softmax clips all values to a relevant value in a softmax curve between 0-1, producing probabilities instead of arbitrary values
        const selected = tf
            .tidy(() => tf.multinomial(softmax, 1, null, true))
            .dataSync(); // use a multinomial distribution to select a random index based on the softmax probabilities

        // add generated token to the array
        decoder_input_ids.push(selected[0]);

        // notify visual handler
        self.postMessage({
            type: "work",
            id: id,
            tokens: decoder_input_ids,
        });

        // if the model generates a stop token, there is no need to waste compute continuing to generate
        if (selected == 1 || selected == 0) {
            break;
        }
    }

    var endTime = performance.now();
    console.log(`Prediction took ${endTime - startTime} milliseconds`);

    console.log(decoder_input_ids);
    self.postMessage({
        type: "done",
        id: id,
        time: Math.round((endTime - startTime) / 1000),
    });
}

tf.loadGraphModel("/model/web/model.json", {
    onProgress: function (fraction) {
        self.postMessage({
            type: "info",
            details: "loading",
            progress: fraction,
        });
    },
})
    .then((loaded) => {
        model = loaded;
        self.postMessage({
            type: "info",
            details: "loaded",
        });
    })
    .then(() => {
        onmessage = (event) => {
            console.log(event);
            tf.tidy(() => generate(event));
        };
    });
