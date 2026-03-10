import * as React from "react";
import { Icon, type IconProps } from "../Icon";

export const MenuIcon: React.FC<IconProps> = (props) => {
    return (
        <Icon {...props}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M5 7H19" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 12H19" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 17H19" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </Icon>
    );
};
