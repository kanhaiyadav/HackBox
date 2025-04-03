// /pages/index.tsx
import type { NextPage } from "next";
import Head from "next/head";
import CurrencyConverter from "./CurrencyConverter";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Advanced Currency Converter</title>
                <meta
                    name="description"
                    content="A feature-rich currency converter with live exchange rates"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <CurrencyConverter />
        </div>
    );
};

export default Home;
