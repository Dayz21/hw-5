import * as React from "react";
import { Icon, type IconProps } from "../Icon";

export const CheckIcon: React.FC<IconProps> = (props) => {
    return (
        <Icon {...props}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M4 11.6129L9.87755 18L20 7" strokeWidth="2" />
            </svg>
        </Icon>
    );
};
