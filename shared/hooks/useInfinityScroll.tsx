"use client";

import { useEffect, useMemo, useRef } from "react";

export const useInfinityScroll = ({ callback }: { callback: () => void }) => {
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    callbackRef.current();
                }
            },
            {
                root: null,
                rootMargin: "0px 0px 800px 0px",
                threshold: 0,
            },
        );

        if (triggerRef.current) {
            observer.observe(triggerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const trigger = useMemo(
        () => (
            <div
                ref={triggerRef}
                style={{
                    width: "100%",
                    height: "1px",
                    position: "absolute",
                    pointerEvents: "none",
                    bottom: 0,
                    left: 0,
                }}
            />
        ),
        [triggerRef],
    );

    return trigger;
};
