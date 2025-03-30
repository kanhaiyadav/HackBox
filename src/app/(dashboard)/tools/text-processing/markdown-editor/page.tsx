import Head from "next/head";
import EnhancedMarkdownEditor from "./EnhancedMarkdownEditor";

export default function MarkdownToolPage() {
    return (
        <div>
            <Head>
                <title>Markdown Tool</title>
                <meta
                    name="description"
                    content="Lightweight Markdown Editor"
                />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
            </Head>

            <EnhancedMarkdownEditor />
        </div>
    );
}
