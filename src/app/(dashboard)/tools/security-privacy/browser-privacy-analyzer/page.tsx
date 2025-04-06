'use client';

// pages/index.tsx
import { useState, useEffect } from 'react';
import { 
  FaUserSecret, 
  FaCookie, 
  FaDesktop, 
  FaGlobe, 
  FaFingerprint, 
  FaNetworkWired,
  FaLock,
  FaFirefox,
  FaLanguage,
  FaClock,
  FaHistory,
  FaRegWindowMaximize
} from 'react-icons/fa';

// Privacy data interface
interface PrivacyData {
  userAgent: string;
  cookies: number;
  cookiesList: string[];
  localStorage: number;
  sessionStorage: number;
  screenResolution: string;
  colorDepth: number;
  timeZone: string;
  language: string;
  platform: string;
  doNotTrack: string;
  plugins: number;
  pluginsList: string[];
  canvas: string;
  webGL: string;
  ip: string;
  browser: string;
  browserVersion: string;
  os: string;
  isPrivateMode: string;
  referrer: string;
  adBlocker: string;
  batteryLevel?: string;
  deviceMemory?: string;
  hardwareConcurrency?: string;
  touchPoints?: string;
  connectionType?: string;
  connectionSpeed?: string;
  leakScore: number;
}

const Home = () => {
    const [privacyData, setPrivacyData] = useState<PrivacyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        analyzePrivacy();
    }, []);

    const analyzePrivacy = async () => {
        setLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            // Get user agent
            const userAgent = navigator.userAgent;

            // Get cookies info
            const cookiesList = document.cookie
                .split(";")
                .filter((cookie) => cookie.trim() !== "");

            // Get storage info
            const localStorageItems = Object.keys(localStorage).length;
            const sessionStorageItems = Object.keys(sessionStorage).length;

            // Get screen info
            const screenResolution = `${window.screen.width}x${window.screen.height}`;
            const colorDepth = window.screen.colorDepth;

            // Get timezone and language
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const language = navigator.language;

            // Get platform and do not track status
            const platform = navigator.platform;
            const doNotTrack = navigator.doNotTrack || "Not available";

            // Get plugins
            let pluginsList: string[] = [];
            if (navigator.plugins) {
                for (let i = 0; i < navigator.plugins.length; i++) {
                    pluginsList.push(navigator.plugins[i].name);
                }
            }

            // Browser fingerprinting checks
            const canvas = checkCanvasFingerprinting();
            const webGL = checkWebGLFingerprinting();

            // Get browser and OS info
            const browserInfo = detectBrowser(userAgent);

            // Check for private mode
            const isPrivateMode =
                "Detection unavailable in this implementation";

            // Get referrer
            const referrer = document.referrer || "No referrer";

            // Check for ad blocker (very basic check)
            const adBlocker = "Detection unavailable in this implementation";

            // Get connection info if available
            let connectionType = "Not available";
            let connectionSpeed = "Not available";
            if ("connection" in navigator) {
                const connection = (navigator as any).connection;
                if (connection) {
                    connectionType =
                        connection.effectiveType || "Not available";
                    connectionSpeed = connection.downlink
                        ? `${connection.downlink} Mbps`
                        : "Not available";
                }
            }

            // Additional device info
            let batteryLevel = "Not available";
            if ("getBattery" in navigator) {
                try {
                    const battery = await (navigator as any).getBattery();
                    batteryLevel = `${Math.floor(battery.level * 100)}%`;
                } catch (e) {
                    console.error("Battery API error:", e);
                }
            }

            const deviceMemory = (navigator as any).deviceMemory
                ? `${(navigator as any).deviceMemory} GB`
                : "Not available";
            const hardwareConcurrency = navigator.hardwareConcurrency
                ? `${navigator.hardwareConcurrency} cores`
                : "Not available";
            const touchPoints = navigator.maxTouchPoints
                ? `${navigator.maxTouchPoints} points`
                : "Not available";

            // Calculate a basic leak score (0-100)
            const leakScore = calculateLeakScore({
                cookiesCount: cookiesList.length,
                localStorage: localStorageItems,
                sessionStorage: sessionStorageItems,
                canvasFingerprinting: canvas !== "Not detected",
                webGLFingerprinting: webGL !== "Not detected",
                pluginsCount: pluginsList.length,
                dntEnabled: doNotTrack === "1" || doNotTrack === "yes",
            });

            // Set mock IP for demo purposes
            const ip = "192.168.x.x (masked)";

            setPrivacyData({
                userAgent,
                cookies: cookiesList.length,
                cookiesList,
                localStorage: localStorageItems,
                sessionStorage: sessionStorageItems,
                screenResolution,
                colorDepth,
                timeZone,
                language,
                platform,
                doNotTrack,
                plugins: pluginsList.length,
                pluginsList,
                canvas,
                webGL,
                ip,
                browser: browserInfo.browser,
                browserVersion: browserInfo.version,
                os: browserInfo.os,
                isPrivateMode,
                referrer,
                adBlocker,
                batteryLevel,
                deviceMemory,
                hardwareConcurrency,
                touchPoints,
                connectionType,
                connectionSpeed,
                leakScore,
            });
        } catch (error) {
            console.error("Error analyzing privacy:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkCanvasFingerprinting = (): string => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return "Not detected";

            // Draw something unique
            ctx.textBaseline = "top";
            ctx.font = "14px Arial";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("Privacy Check", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("Privacy Check", 4, 17);

            return "Fingerprinting possible";
        } catch (e) {
            return "Not detected";
        }
    };

    const checkWebGLFingerprinting = (): string => {
        try {
            const canvas = document.createElement("canvas");
            const gl =
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");
            if (!gl) return "Not detected";

            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            if (debugInfo) {
                const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const renderer = gl.getParameter(
                    debugInfo.UNMASKED_RENDERER_WEBGL
                );
                return vendor && renderer
                    ? "Fingerprinting possible"
                    : "Limited fingerprinting";
            }
            return "Limited fingerprinting";
        } catch (e) {
            return "Not detected";
        }
    };

    const detectBrowser = (
        userAgent: string
    ): { browser: string; version: string; os: string } => {
        let browser = "Unknown";
        let version = "Unknown";
        let os = "Unknown";

        // OS detection
        if (userAgent.indexOf("Windows") !== -1) os = "Windows";
        else if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
        else if (userAgent.indexOf("Linux") !== -1) os = "Linux";
        else if (userAgent.indexOf("Android") !== -1) os = "Android";
        else if (
            userAgent.indexOf("iOS") !== -1 ||
            userAgent.indexOf("iPhone") !== -1 ||
            userAgent.indexOf("iPad") !== -1
        )
            os = "iOS";

        // Browser detection
        if (userAgent.indexOf("Firefox") !== -1) {
            browser = "Firefox";
            version = userAgent.split("Firefox/")[1].split(" ")[0];
        } else if (
            userAgent.indexOf("Edge") !== -1 ||
            userAgent.indexOf("Edg/") !== -1
        ) {
            browser = "Edge";
            version =
                userAgent.indexOf("Edge/") !== -1
                    ? userAgent.split("Edge/")[1].split(" ")[0]
                    : userAgent.split("Edg/")[1].split(" ")[0];
        } else if (userAgent.indexOf("Chrome") !== -1) {
            browser = "Chrome";
            version = userAgent.split("Chrome/")[1].split(" ")[0];
        } else if (
            userAgent.indexOf("Safari") !== -1 &&
            userAgent.indexOf("Chrome") === -1
        ) {
            browser = "Safari";
            version = userAgent.split("Safari/")[1].split(" ")[0];
        } else if (
            userAgent.indexOf("Opera") !== -1 ||
            userAgent.indexOf("OPR") !== -1
        ) {
            browser = "Opera";
            version =
                userAgent.indexOf("Opera/") !== -1
                    ? userAgent.split("Opera/")[1].split(" ")[0]
                    : userAgent.split("OPR/")[1].split(" ")[0];
        }

        return { browser, version, os };
    };

    const calculateLeakScore = (factors: {
        cookiesCount: number;
        localStorage: number;
        sessionStorage: number;
        canvasFingerprinting: boolean;
        webGLFingerprinting: boolean;
        pluginsCount: number;
        dntEnabled: boolean;
    }): number => {
        let score = 0;

        // Cookie factors (0-20 points)
        if (factors.cookiesCount > 0) {
            score += Math.min(factors.cookiesCount * 2, 20);
        }

        // Storage factors (0-15 points)
        score += Math.min(factors.localStorage + factors.sessionStorage, 15);

        // Fingerprinting factors (0-30 points)
        if (factors.canvasFingerprinting) score += 15;
        if (factors.webGLFingerprinting) score += 15;

        // Plugins factor (0-10 points)
        score += Math.min(factors.pluginsCount, 10);

        // DNT factor (reduce 10 points if enabled)
        if (factors.dntEnabled) score = Math.max(0, score - 10);

        // Scale to 0-100
        return Math.min(score * 1.25, 100);
    };

    const getLeakScoreCategory = (
        score: number
    ): { label: string; color: string } => {
        if (score < 30) return { label: "Low Risk", color: "text-green-400" };
        if (score < 60)
            return { label: "Medium Risk", color: "text-yellow-400" };
        return { label: "High Risk", color: "text-red-400" };
    };

    const renderOverview = () => {
        if (!privacyData) return null;

        const scoreCategory = getLeakScoreCategory(privacyData.leakScore);

        return (
            <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Privacy Score</h2>
                    <div className="flex items-center">
                        <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`absolute top-0 left-0 h-full ${
                                    privacyData.leakScore < 30
                                        ? "bg-green-500"
                                        : privacyData.leakScore < 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{ width: `${privacyData.leakScore}%` }}
                            ></div>
                        </div>
                        <span
                            className={`ml-4 text-xl font-bold ${scoreCategory.color}`}
                        >
                            {privacyData.leakScore}/100
                        </span>
                    </div>
                    <p className={`mt-2 text-lg ${scoreCategory.color}`}>
                        {scoreCategory.label}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center mb-3">
                            <FaFirefox className="text-blue-400 text-xl mr-2" />
                            <h3 className="text-lg font-semibold">Browser</h3>
                        </div>
                        <p>
                            {privacyData.browser} {privacyData.browserVersion}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            {privacyData.os}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center mb-3">
                            <FaCookie className="text-yellow-400 text-xl mr-2" />
                            <h3 className="text-lg font-semibold">Cookies</h3>
                        </div>
                        <p>{privacyData.cookies} cookies stored</p>
                        <p
                            className={`text-sm mt-1 ${
                                privacyData.cookies > 5
                                    ? "text-yellow-400"
                                    : "text-green-400"
                            }`}
                        >
                            {privacyData.cookies > 5
                                ? "High tracking potential"
                                : "Low tracking potential"}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center mb-3">
                            <FaFingerprint className="text-purple-400 text-xl mr-2" />
                            <h3 className="text-lg font-semibold">
                                Fingerprinting
                            </h3>
                        </div>
                        <p>Canvas: {privacyData.canvas}</p>
                        <p>WebGL: {privacyData.webGL}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center mb-3">
                            <FaRegWindowMaximize className="text-green-400 text-xl mr-2" />
                            <h3 className="text-lg font-semibold">Screen</h3>
                        </div>
                        <p>Resolution: {privacyData.screenResolution}</p>
                        <p>Color depth: {privacyData.colorDepth} bit</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center mb-3">
                            <FaHistory className="text-red-400 text-xl mr-2" />
                            <h3 className="text-lg font-semibold">Storage</h3>
                        </div>
                        <p>LocalStorage: {privacyData.localStorage} items</p>
                        <p>
                            SessionStorage: {privacyData.sessionStorage} items
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center mb-3">
                            <FaNetworkWired className="text-blue-400 text-xl mr-2" />
                            <h3 className="text-lg font-semibold">
                                Connection
                            </h3>
                        </div>
                        <p>Type: {privacyData.connectionType}</p>
                        <p>Speed: {privacyData.connectionSpeed}</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderDetails = () => {
        if (!privacyData) return null;

        return (
            <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <FaUserSecret className="mr-2" /> Browser Identification
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                User Agent
                            </h3>
                            <p className="text-sm break-all bg-gray-900 p-2 rounded mt-1">
                                {privacyData.userAgent}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-300">
                                    Browser
                                </h3>
                                <p>
                                    {privacyData.browser}{" "}
                                    {privacyData.browserVersion}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-300">
                                    Operating System
                                </h3>
                                <p>{privacyData.os}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-300">
                                    Platform
                                </h3>
                                <p>{privacyData.platform}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-300">
                                    Private Mode
                                </h3>
                                <p>{privacyData.isPrivateMode}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <FaGlobe className="mr-2" /> Location & Language
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                IP Address
                            </h3>
                            <p>{privacyData.ip}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                Time Zone
                            </h3>
                            <p>{privacyData.timeZone}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                Language
                            </h3>
                            <p>{privacyData.language}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                Referrer
                            </h3>
                            <p className="truncate">{privacyData.referrer}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <FaDesktop className="mr-2" /> Hardware & Device
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                Screen Resolution
                            </h3>
                            <p>{privacyData.screenResolution}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                Color Depth
                            </h3>
                            <p>{privacyData.colorDepth} bit</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                Device Memory
                            </h3>
                            <p>{privacyData.deviceMemory}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                CPU Cores
                            </h3>
                            <p>{privacyData.hardwareConcurrency}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                Touch Points
                            </h3>
                            <p>{privacyData.touchPoints}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-300">
                                Battery Level
                            </h3>
                            <p>{privacyData.batteryLevel}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderFingerprinting = () => {
        if (!privacyData) return null;

        return (
            <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <FaFingerprint className="mr-2" /> Browser
                        Fingerprinting
                    </h2>
                    <p className="mb-4 text-gray-300">
                        Fingerprinting techniques allow websites to identify and
                        track you based on your browser's unique
                        characteristics, even without cookies or local storage.
                    </p>

                    <div className="space-y-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                Canvas Fingerprinting
                            </h3>
                            <p className="mb-2">
                                Status:{" "}
                                <span
                                    className={
                                        privacyData.canvas.includes("possible")
                                            ? "text-red-400"
                                            : "text-green-400"
                                    }
                                >
                                    {privacyData.canvas}
                                </span>
                            </p>
                            <p className="text-sm text-gray-300">
                                Canvas fingerprinting uses the HTML5 Canvas
                                element to draw invisible images and create a
                                unique identifier based on how your system
                                renders graphics.
                            </p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                WebGL Fingerprinting
                            </h3>
                            <p className="mb-2">
                                Status:{" "}
                                <span
                                    className={
                                        privacyData.webGL.includes("possible")
                                            ? "text-red-400"
                                            : "text-green-400"
                                    }
                                >
                                    {privacyData.webGL}
                                </span>
                            </p>
                            <p className="text-sm text-gray-300">
                                WebGL fingerprinting identifies your graphics
                                hardware and drivers by accessing detailed
                                rendering information through the WebGL API.
                            </p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                Audio Fingerprinting
                            </h3>
                            <p className="mb-2">
                                Status:{" "}
                                <span className="text-gray-400">
                                    Not tested
                                </span>
                            </p>
                            <p className="text-sm text-gray-300">
                                Audio fingerprinting creates a unique identifier
                                based on how your device processes audio
                                signals.
                            </p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                Font Fingerprinting
                            </h3>
                            <p className="mb-2">
                                Status:{" "}
                                <span className="text-gray-400">
                                    Not tested
                                </span>
                            </p>
                            <p className="text-sm text-gray-300">
                                Font fingerprinting identifies you by detecting
                                which fonts are installed on your system.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">
                        Unique Identifiers
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold">
                                Browser Plugins ({privacyData.plugins})
                            </h3>
                            <div className="mt-1 text-sm bg-gray-900 p-2 rounded max-h-32 overflow-y-auto">
                                {privacyData.pluginsList.length > 0 ? (
                                    privacyData.pluginsList.map(
                                        (plugin, index) => (
                                            <div
                                                key={index}
                                                className="py-1 border-b border-gray-700 last:border-0"
                                            >
                                                {plugin}
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p className="text-gray-400">
                                        No plugins detected
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderProtection = () => {
        return (
            <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <FaLock className="mr-2" /> Privacy Protection
                        Recommendations
                    </h2>
                    <p className="mb-4 text-gray-300">
                        Based on your scan results, here are some
                        recommendations to enhance your browser privacy:
                    </p>

                    <div className="space-y-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                Use a Privacy-Focused Browser
                            </h3>
                            <p className="text-sm text-gray-300">
                                Consider using browsers like Firefox, Brave, or
                                Tor Browser that have built-in privacy features.
                            </p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                Install Privacy Extensions
                            </h3>
                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-2 mt-2">
                                <li>uBlock Origin - Block ads and trackers</li>
                                <li>
                                    Privacy Badger - Learns to block invisible
                                    trackers
                                </li>
                                <li>
                                    Cookie AutoDelete - Automatically deletes
                                    cookies when tabs are closed
                                </li>
                                <li>
                                    HTTPS Everywhere - Forces websites to use
                                    secure connections
                                </li>
                                <li>
                                    Canvas Blocker - Prevents canvas
                                    fingerprinting
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                Adjust Browser Settings
                            </h3>
                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-2 mt-2">
                                <li>
                                    Enable &quot;Do Not Track&quot; in your browser
                                    settings
                                </li>
                                <li>
                                    Block third-party cookies or all cookies
                                </li>
                                <li>Disable JavaScript for untrusted sites</li>
                                <li>Use private/incognito browsing mode</li>
                                <li>Regularly clear browsing data</li>
                            </ul>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg">
                                Consider Using a VPN
                            </h3>
                            <p className="text-sm text-gray-300">
                                A VPN (Virtual Private Network) encrypts your
                                internet connection and masks your IP address,
                                enhancing your privacy online.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-xl">Analyzing browser privacy...</p>
                </div>
            );
        }

        if (!privacyData) {
            return (
                <div className="text-center p-12">
                    <p className="text-xl text-red-400">
                        Failed to analyze browser privacy. Please try again.
                    </p>
                    <button
                        onClick={analyzePrivacy}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Retry Analysis
                    </button>
                </div>
            );
        }

        switch (activeTab) {
            case "overview":
                return renderOverview();
            case "details":
                return renderDetails();
            case "fingerprinting":
                return renderFingerprinting();
            case "protection":
                return renderProtection();
            default:
                return renderOverview();
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaUserSecret className="text-blue-400 text-3xl mr-3" />
                            <h1 className="text-2xl font-bold">
                                Browser Privacy Analyzer
                            </h1>
                        </div>

                        <button
                            onClick={analyzePrivacy}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                    Scanning...
                                </>
                            ) : (
                                <>Rescan</>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="flex overflow-x-auto">
                        <button
                            className={`px-6 py-3 focus:outline-none ${
                                activeTab === "overview"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                            }`}
                            onClick={() => setActiveTab("overview")}
                        >
                            Overview
                        </button>
                        <button
                            className={`px-6 py-3 focus:outline-none ${
                                activeTab === "details"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                            }`}
                            onClick={() => setActiveTab("details")}
                        >
                            Detailed Info
                        </button>
                        <button
                            className={`px-6 py-3 focus:outline-none ${
                                activeTab === "fingerprinting"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                            }`}
                            onClick={() => setActiveTab("fingerprinting")}
                        >
                            Fingerprinting
                        </button>
                        <button
                            className={`px-6 py-3 focus:outline-none ${
                                activeTab === "protection"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                            }`}
                            onClick={() => setActiveTab("protection")}
                        >
                            Protection Tips
                        </button>
                    </div>
                    <div className="p-6">{renderTabContent()}</div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">About This Tool</h2>
                    <p className="text-gray-300">
                        This Browser Privacy Analyzer demonstrates how easily
                        websites can collect information about your browser,
                        device, and behavior without your explicit consent. All
                        data is processed locally in your browser and is never
                        sent to any server.
                    </p>
                    <div className="mt-4 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg">
                        <h3 className="font-semibold text-yellow-400 flex items-center">
                            <FaUserSecret className="mr-2" /> Privacy Notice
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                            This tool is for educational purposes only. It helps
                            you understand what information your browser reveals
                            to websites you visit. No data is collected, stored,
                            or transmitted to any third party.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 border-t border-gray-700 py-6">
                <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
                    <p>
                        Browser Privacy Analyzer &copy;{" "}
                        {new Date().getFullYear()}
                    </p>
                    <p className="mt-2">
                        Created for educational purposes to promote privacy
                        awareness.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;