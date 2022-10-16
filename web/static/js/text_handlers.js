let buffer = ""
let completion_buffer = ""
let improvement_buffer = ""
let completionTimeout;

const body = document.getElementById("body")
textarea = null
last_key = ''

function clear_buffers() {
    completion_buffer = ""
    improvement_buffer = ""
    update_text_from_buffers()
}

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
    <div class="navbar bg-neutral rounded-b-lg">
        <div class="flex-1">
            <a class="btn btn-ghost normal-case text-xl">Polish 💅</a>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal p-0">
                <li class="disabled"><div class="tooltip tooltip-bottom" data-tip="Speech to Text (Disabled)">🎙️</div></li>
                <li onclick="clear_buffers()"><div class="tooltip tooltip-bottom" data-tip="Clear Comparisons">❌</div></li>
                <li onclick="generate_from_buffers()"><div class="tooltip tooltip-bottom" data-tip="Generate!">✨</div></li>
            </ul>
        </div>
    </div>
    ` + body.innerHTML
    main_page = document.getElementById("main_page");
    textarea = document.getElementById("textarea");
}

function generate_from_buffers() {
    predict("improve", "improve: " + buffer.replaceAll("\n", " "))
    predict("complete", "complete: " + buffer)
    completion_buffer = ""
    improvement_buffer = ""
    update_text_from_buffers()
}

document.onkeydown = function (event) {
    clearTimeout(completionTimeout)
    last_completion_buffer = completion_buffer
    completion_buffer = ""
    update_text_from_buffers()
    if (warmed_up && textarea !== null)  {
        event = event || window.event;
        if (last_key !== "Control" || last_key !== "Alt" || last_key !== "Meta") {
            switch(event.key) {
                case "Backspace":
                    buffer = buffer.slice(0, -1)
                    improvement_buffer = ""
                    break;
                case "Enter":
                    buffer += "\n"
                    break;
                case "Tab":
                    buffer += last_completion_buffer.startsWith(" ") ? last_completion_buffer : " " + last_completion_buffer
                    break;
                default:
                    if (event.key.length == 1) {
                        buffer += event.key
                    }
            }
        } else if (last_key === "Control" && event.key.toLowerCase() === "v") {
            console.log("bruh")
            setTimeout(async () => {
                buffer += await navigator.clipboard.readText();
            }, 1000);
        }
    }
    update_text_from_buffers()
    last_key = event.key
};

function accept_completion() {
    last_completion_buffer = completion_buffer
    completion_buffer = ""
    improvement_buffer = ""
    buffer += last_completion_buffer.startsWith(" ") ? last_completion_buffer : " " + last_completion_buffer
    generate_from_buffers()
}

function accept_improvement(id) {
    new_buffer = ""
    for(var i=0; i<textarea.children.length; i++){
        children[i].id != id
        
    }
}

document.onkeyup = function () {
    clearTimeout(completionTimeout)
    completionTimeout = setTimeout(generate_from_buffers, 2500)
}

// Prevent non-targeted space from adding space
window.addEventListener('keydown', (e) => {  
    if ((e.key === " " || e.key == "Tab") && e.target === document.body) {  
        e.preventDefault();  
    }  
});

window.addEventListener('keydown', (e) => {  
    if ((e.key === " " || e.key == "Tab") && e.target === document.body) {  
        e.preventDefault();  
    }  
});

function update_text_from_buffers() {
    build = ""
    diff = Diff.diffWords(buffer, improvement_buffer);
    diff.forEach(element => {
        const color = element.added ? 'green' : element.removed ? 'red' : 'grey';
        id_string = color == 'green' || color == "red" ? `id=${uuidv4()}` : ""
        build += `<span class="text-${color}-200" ${id_string} hover:bg-base-300 rounded">${element.value}</span>`
    });
    
    build = build.replaceAll("\n", "<br>") + '<span id="cursor">| </span>' + `<span style="opacity:50%" class="hover:bg-base-300 rounded" onclick=accept_completion()> ${completion_buffer}</span>`

    textarea.innerHTML = build
}