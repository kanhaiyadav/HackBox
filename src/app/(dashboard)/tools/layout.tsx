import React from "react";
import PageWrapper from "./PageWrapper";

const layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <PageWrapper >{children}</PageWrapper>
        </div>
    );
};

export default layout;
