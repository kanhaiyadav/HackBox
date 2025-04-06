import type { NextPage } from "next";
import Head from "next/head";
import DecisionSpinner from "./DecisionSpinner";

const Home: NextPage = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            <Head>
                <title>Decision Spinner</title>
                <meta
                    name="description"
                    content="Customizable spinning wheel for decision making"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <DecisionSpinner />
            </main>
        </div>
    );
};

export default Home;
