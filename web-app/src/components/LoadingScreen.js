import React from "react";
import { atom, useRecoilValue } from "recoil";

export const loadingProgressState = atom({
    key: "loadingProgress",
    default: 0,
});

export const loadingWarmupState = atom({
    key: "loadingWarmup",
    default: "...",
});

function LoadingScreen() {
    const progress = useRecoilValue(loadingProgressState);
    const warmup = useRecoilValue(loadingWarmupState);

    return (
        <div className="hero min-h-screen bg-base-400">
            <div className="hero-content text-center">
                <div className="max-w-lg">
                    <h1 className="text-5xl font-bold">
                        Polish{" "}
                        <span role="img" aria-label="nails">
                            💅
                        </span>
                    </h1>
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

export default LoadingScreen;
