import { NextPage } from 'next';
import Head from 'next/head';
import ColorBlindnessSimulator from './color-blindness-simulator';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Color Blindness Simulator</title>
        <meta name="description" content="Simulate various types of color blindness and get accessibility suggestions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <ColorBlindnessSimulator />
      </main>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>Color Blindness Simulator - A tool for understanding color accessibility</p>
      </footer>
    </div>
  );
};

export default Home;