var cursor = true;
var speed = 500;

Array.prototype.sample = function() {
    return this[Math.floor(Math.random()*this.length)];
}

// blinking cursor
setInterval(() => {
    if (warmed_up) {
        if(cursor) {
            document.getElementById('cursor').style.opacity = 0.2;
            cursor = false;
        } else {
            document.getElementById('cursor').style.opacity = 1;
            cursor = true;
        }
    }
}, speed);