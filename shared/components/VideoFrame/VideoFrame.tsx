import type React from "react";
import classNames from "classnames";
import styles from "./VideoFrame.module.scss";

export type VideoFrameProps = {
    src?: string;
    title?: string;
    className?: string;
};

export const VideoFrame: React.FC<VideoFrameProps> = ({ src, title, className }) => {
    if (!src) return <div className={styles.video_frame_skeleton} />;

    return (
        <iframe
            className={classNames(styles.video_frame, className)}
            src={src}
            title={title}
            allow="fullscreen"
        />
    );
};
