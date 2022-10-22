import React from "react";

function NavBarComponent() {
    return (
        <div className="navbar bg-neutral rounded-b-lg">
            <div className="flex-1">
                <button className="btn btn-ghost normal-case text-xl">
                    Polish 💅
                </button>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal p-0">
                    <li className="disabled">
                        <div
                            className="tooltip tooltip-bottom"
                            data-tip="Speech to Text (Disabled)"
                        >
                            🎙️
                        </div>
                    </li>
                    <li>
                        <div
                            className="tooltip tooltip-bottom"
                            data-tip="Clear Comparisons"
                        >
                            ❌
                        </div>
                    </li>
                    <li>
                        <div
                            className="tooltip tooltip-bottom"
                            data-tip="Generate!"
                        >
                            ✨
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default NavBarComponent;
