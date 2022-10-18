function FooterComponent() {
    return (
    <footer class="footer p-10 bg-neutral text-neutral-content rounded-t-lg">
        <div>
            <span class="footer-title">Contributors</span> 
            <a class="link link-hover" href="https://github.com/JEF1056">Jess Fan</a>
            <button class="link link-hover">Ines B</button>
            <button class="link link-hover">Nick Beckman</button>
            <button class="link link-hover">Elisa Kim</button>
        </div>
        <div>
            <span class="footer-title">Instructions</span>
            <p>Just type your text! Wait 2 seconds for the model to begin generation</p>
            <p>[TAB] Key: Accept sentence completion</p>
            <span class="text-green-200 hover:bg-base-200 rounded">Click to accept addition</span>
            <span class="text-red-200 hover:bg-base-200 rounded">Click to accept removal</span>
            <span class="opacity-50 hover:bg-base-100 rounded">Click to accept sentence completion</span>
        </div>
    </footer>
    );
}

export default FooterComponent;
