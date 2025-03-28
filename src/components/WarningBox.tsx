import React from "react";
import { TiWarningOutline } from "react-icons/ti";

const WarningBox = () => {
    return (
        <div className="w-fit h-fit bg-yellow-500/10 border-l-[3.5px] border-yellow-500 relative px-[15px] pt-[30px] pb-[15px]">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="37.5"
                height="35"
                fill="none"
                viewBox="0 0 75 70"
                preserveAspectRatio="none"
                className="absolute top-0 left-[-3px]"
            >
                <path
                    className="fill-background"
                    d="M54.3545 15.0483L46 0.5H0V64L5.42113 56.1695C7.66253 52.9319 11.3497 51 15.2874 51H33.542C51.9925 51 63.5426 31.0483 54.3545 15.0483Z"
                ></path>
                <path
                    className="fill-yellow-500"
                    d="M52.1101 4.52096C51.2932 3.07946 49.4625 2.57308 48.021 3.38993C46.5795 4.20678 46.0731 6.03754 46.8899 7.47904L52.1101 4.52096ZM15 54H37.2466V48H15V54ZM0 63V69.5H6V63H0ZM46.8899 7.47904L53.777 19.6328L58.9972 16.6747L52.1101 4.52096L46.8899 7.47904ZM37.2466 54C56.4023 54 68.4412 33.3405 58.9972 16.6747L53.777 19.6328C60.9545 32.2988 51.8049 48 37.2466 48V54ZM15 48C6.71573 48 0 54.7157 0 63H6C6 58.0294 10.0294 54 15 54V48Z"
                ></path>
            </svg>
            <TiWarningOutline className="text-yellow-500 text-4xl absolute top-0 left-0 transform -translate-x-1/2 -translate-y-[15px] z-2" />
            <p className="">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Asperiores suscipit doloremque tempora labore reiciendis placeat
                voluptatibus unde quas eligendi magni cupiditate, deleniti sed
                magnam aspernatur ratione obcaecati, quam nihil eaque?
            </p>
        </div>
    );
};

export default WarningBox;
