import React from "react";
import ContentEditable from "react-contenteditable";
import ReactDOMServer from "react-dom/server";
import * as cldrSegmentation from "cldr-segmentation";
import { atom, RecoilRoot, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import NavBarComponent from "./NavBarComponent";
import { v4 as uuid } from "uuid";
import { predict } from "../inference/predict";

const { persistAtom } = recoilPersist();
const dividingCharacter = "\u200b";

export const inputTextState = atom({
    key: "inputText",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const continueTextState = atom({
    key: "continueText",
    default: "",
});

function createStyledOutput(inputText, continueText) {
    return ReactDOMServer.renderToStaticMarkup(
        <RecoilRoot>
            {inputText.map((sentence) => (
                <span key={uuid()} className="hover:bg-neutral rounded">
                    {sentence}
                </span>
            ))}
            <span
                className="opacity-50 hover:bg-base-100 rounded"
                contentEditable={false}
            >
                {dividingCharacter}
                {continueText}
            </span>
        </RecoilRoot>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.editableRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event);

        // do not react to arrow or meta key events
        if (!event.code) {
            clearTimeout(this.completionTimeout);

            // get sentence segmentation
            let [inputText, continueText] =
                this.editableRef.current.innerText.split(dividingCharacter);

            // Compute if the inputText is being modified or continueText.
            // Propogate changes to inputText if continueText is changed
            if (this.props.atoms.continueText.value !== continueText) {
                // do expected action against real text
                if (
                    event.nativeEvent.data ||
                    event.nativeEvent.inputType === "insertFromPaste"
                ) {
                    inputText += continueText.slice(
                        this.props.atoms.continueText.value.length
                    );
                } else if (
                    event.nativeEvent.inputType === "deleteContentBackward"
                ) {
                    inputText = inputText.slice(0, -1);
                }

                // reset cursor position
                setTimeout(
                    () =>
                        window
                            .getSelection()
                            .collapse(
                                this.editableRef.current,
                                this.props.atoms.inputText.value.length > 0
                                    ? this.props.atoms.inputText.value.length
                                    : 0
                            ),
                    10
                );
            }

            // set inputTextState and clear continueTextState
            this.props.atoms.inputText.set(
                cldrSegmentation.sentenceSplit(inputText)
            );

            this.props.atoms.continueText.set("");

            if (inputText) {
                this.completionTimeout = setTimeout(
                    () => predict("continue", "continue: " + inputText),
                    2000
                );
            }
        }
    }

    render() {
        return (
            <div>
                <NavBarComponent />
                <ContentEditable
                    className="outline-none min-h-screen bg-base-400 text-left p-5"
                    innerRef={this.editableRef}
                    html={createStyledOutput(
                        this.props.atoms.inputText.value,
                        this.props.atoms.continueText.value
                    )}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

function AppScreen() {
    const [inputText, setInputText] = useRecoilState(inputTextState);
    const [continueText, setContinueText] = useRecoilState(continueTextState);

    const props = {
        inputText: {
            value: inputText,
            set: setInputText,
        },
        continueText: {
            value: continueText,
            set: setContinueText,
        },
    };

    return <App atoms={props} />;
}

export default AppScreen;
