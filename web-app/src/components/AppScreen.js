import React from "react";
import ContentEditable from "react-contenteditable";
import ReactDOMServer from "react-dom/server";
import * as cldrSegmentation from "cldr-segmentation";
// import { atom, useRecoilValue } from "recoil";

class AppScreen extends React.Component {
    constructor(props) {
        super(props);
        this.editableRef = React.createRef(null);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            data: "",
        };
    }

    handleChange() {
        // get sentence segmentation
        let segments = cldrSegmentation.sentenceSplit(
            this.editableRef.current.innerText
        );
        
        // 
        this.setState({
            data: ReactDOMServer.renderToStaticMarkup(
                segments.map((sentence) => (
                    <span className="hover:bg-neutral rounded">{sentence}</span>
                ))
            ),
        });
    }

    render() {
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

                <ContentEditable
                    className="outline-none min-h-screen bg-base-400 text-left p-5"
                    innerRef={this.editableRef}
                    html={this.state.data}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default AppScreen;
