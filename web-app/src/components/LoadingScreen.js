import React from React;

export const progress = 10;
export const warmup = "...";

export const ThemeContext = React.createContext(
    themes.dark // default value
 );

class LoadingScreen extends React.Component {
    render() {
        return (
            <div className="hero min-h-screen bg-base-400">
                <div className="hero-content text-center">
                    <div className="max-w-lg">
                        <h1 className="text-5xl font-bold">Polish 💅</h1>
                        <progress
                            className="progress progress-primary w-56 my-6"
                            value={progress}
                            max={100}
                        ></progress>
                        <p>{warmup}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoadingScreen;