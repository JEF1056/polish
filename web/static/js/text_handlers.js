let buffer = ""
const body = document.getElementById("body")
textarea = null

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
    if (warmed_up && textarea !== null) {
        event = event || window.event;
        console.log(event.key)
    }
};

// Prevent non-targeted space from adding space
window.addEventListener('keydown', (e) => {  
    if (e.key === " " && e.target === document.body) {  
        e.preventDefault();  
    }  
});