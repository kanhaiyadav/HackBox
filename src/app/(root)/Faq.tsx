import React from "react";
import FaqContainer from "./FaqContainer";
import Link from "next/link";

const Faq = () => {
    return (
        <section id="faq" className="min-h-screen xs:mx-auto w-full px-6 pt-[50px] pb-[50px] ">
            <div className="text-center mb-6">
                <h2 className="text-5xl font-bold mb-4">
                    FAQ
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto cursor-default">
                    Have a question? We have answers! Check out our frequently asked questions below. If you still need help, feel free to reach out to us
                    &nbsp;<Link href={'/contact-us'} className="underline underline-offset-2 cursor-pointer hover:text-primary">here</Link>.
                </p>
            </div>

            <FaqContainer />
            
        </section>
    );
};

export default Faq;
