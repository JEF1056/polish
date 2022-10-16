const main_page = document.getElementById("main_page");
const loading_progress = document.getElementById("loading_progress");
const loading_warmup = document.getElementById("loading_warmup");

function set_progress(value, done) {
    if (!done) {
        loading_progress.value = (value * 90).toString()
    } else {
        loading_progress.value = "100"
        // setTimeout(function(){ main_page.remove() }, 5000);
    }
}

function set_warmup(text) {
    loading_warmup.innerHTML = text
}