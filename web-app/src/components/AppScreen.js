import React from "react";
// import { atom, useRecoilValue } from "recoil";

function AppScreen() {
    return (
        <div>
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

            <div
                contentEditable={true}
                className="outline-none min-h-screen bg-base-400 text-left p-5"
            />
        </div>
    );
}

export default AppScreen;
