import React from "react";

function FooterComponent() {
    return (
        <footer className="footer p-10 bg-neutral text-neutral-content rounded-t-lg">
            <div>
                <span className="footer-title">Contributors</span>
                <a
                    className="link link-hover"
                    href="https://github.com/JEF1056"
                >
                    Jess Fan
                </a>
                <button className="link link-hover">Ines B</button>
                <button className="link link-hover">Nick Beckman</button>
                <button className="link link-hover">Elisa Kim</button>
            </div>
            <div>
                <span className="footer-title">Instructions</span>
                <p>
                    Just type your text! Wait 2 seconds for the model to begin
                    generation
                </p>
                <p>[TAB] Key: Accept sentence completion</p>
                <span className="text-green-200 hover:bg-base-200 rounded">
                    Click to accept addition
                </span>
                <span className="text-red-200 hover:bg-base-200 rounded">
                    Click to accept removal
                </span>
                <span className="opacity-50 hover:bg-base-100 rounded">
                    Click to accept sentence completion
                </span>
            </div>
        </footer>
    );
}

export default FooterComponent;
