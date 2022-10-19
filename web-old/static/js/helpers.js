var cursor = true;
var speed = 500;
const max_len = 64

Array.prototype.sample = function() {
    return this[Math.floor(Math.random()*this.length)];
}

// blinking cursor
setInterval(() => {
    if (warmed_up) {
        try {
            if(cursor) {
                document.getElementById('cursor').style.opacity = 0.2;
                cursor = false;
            } else {
                document.getElementById('cursor').style.opacity = 1;
                cursor = true;
            }
        } catch {}
    }
}, speed);

function subdivide_buffer() {
    split_buffer = buffer.split(" ")

    temp_buffer = ''

    while (tokenize(temp_buffer).length < max_len && split_buffer.length > 0) {
        temp_buffer += split_buffer.pop()
    }

    console.log(temp_buffer, tokenize(temp_buffer))
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

