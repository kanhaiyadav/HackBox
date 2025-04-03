import Head from "next/head";
import Script from "next/script";
import EnhancedMarkdownEditor from "./EnhancedMarkdownEditor";

export default function MarkdownToolPage() {
    return (
        <div>
            <Head>
                <meta
                    name="description"
                    content="Lightweight Markdown Editor"
                />
            </Head>
            
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"
                strategy="afterInteractive"
            />

            <EnhancedMarkdownEditor />
        </div>
    );
}
