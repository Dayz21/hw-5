import * as React from "react";
import { Icon, type IconProps } from "../Icon";

export const StarIcon: React.FC<IconProps> = (props) => {
    return (
        <Icon {...props}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9.08336 0.75L11.6584 5.96667L17.4167 6.80833L13.25 10.8667L14.2334 16.6L9.08336 13.8917L3.93336 16.6L4.9167 10.8667L0.750031 6.80833L6.50836 5.96667L9.08336 0.75Z"
                    fill="#F5C518"
                    stroke="#F5C518"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </Icon>
    );
};
