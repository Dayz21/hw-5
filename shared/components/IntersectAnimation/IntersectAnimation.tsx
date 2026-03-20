import classNames from "classnames";
import styles from "./IntersectAnimation.module.scss";
import { useEffect, useRef, useState } from "react";

type IntersectAnimationProps = {
    children: React.ReactNode;
};

export const IntersectAnimation: React.FC<IntersectAnimationProps> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                setIsActive(true);
                observer.disconnect();
            }
        }, {
            threshold: 0,
        })

        if (!ref.current) return;
        observer.observe(ref.current);
    }, []);

    return (
        <div ref={ref} className={classNames(styles.container, { [styles.active]: isActive })}>
            {children}
        </div>
    );
}