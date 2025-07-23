import React from "react";
import clsx from "clsx";

const SkeletonText = ({ width = "w-full", height = "h-auto", className = "" }) => {
    return (
        <div
            className={clsx(
                "bg-gray-300 rounded animate-pulse",
                width,
                height,
                className
            )}
        ></div>
    );
};

export default SkeletonText;
