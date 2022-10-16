let buffer = ""
let completion_buffer = ""

const body = document.getElementById("body")
textarea = null
last_key = ''

function init_writing() {
    main_page.classList.remove("hero")
    main_page.innerHTML = `
    <div class="text-left p-5">
        <p id="textarea">
            <span id="cursor">|</span>
        </p>
    </div>
    `
    body.innerHTML = `
    <div class="navbar bg-neutral">
        <div class="flex-1">
            <a class="btn btn-ghost normal-case text-xl">Polish 💅</a>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal p-0">
                <li><a>✨</a></li>
            </ul>
        </div>
    </div>
    ` + body.innerHTML
    main_page = document.getElementById("main_page");
    textarea = document.getElementById("textarea");
}

document.onkeydown = function (event) {
    if (warmed_up && textarea !== null && !(last_key in ["Meta", "Alt", "Control"])) {
        event = event || window.event;
        console.log(event.key)
        switch(event.key) {
            case "Backspace":
                buffer = buffer.slice(0, -1)
                break;
            case "Enter":
                buffer += "\n"
                break;
            default:
                if (event.key.length == 1) {
                    buffer += event.key
                }
        }
        update_text_from_buffers()
    }
    last_key = event.key
};

// Prevent non-targeted space from adding space
window.addEventListener('keydown', (e) => {  
    if (e.key === " " && e.target === document.body) {  
        e.preventDefault();  
    }  
});

function update_text_from_buffers() {
    build = ""
    diff = Diff.diffWords(buffer, "baked beans");
    diff.forEach(element => {
        const color = element.added ? 'green' : element.removed ? 'red' : 'grey';
        build += `<span class="text-${color}-200">${element.value}</span>`
    });
    
    build = build.replaceAll("\n", "<br>") + '<span id="cursor">| </span>' + `<span class="text-white/25">this is a test btw</span>`

    textarea.innerHTML = build
}