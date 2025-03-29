import React from "react";
import PageWrapper from "./PageWrapper";

const layout = async ({ children }: { children: React.ReactNode }) => {
    return <PageWrapper>{children}</PageWrapper>;
};

export default layout;
