"use client";
import { useState, useRef, useEffect } from "react";
// import QRCode from "qrcode";
import { toCanvas } from "qrcode";
import { saveAs } from "file-saver";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    qrContentOptions,
    qrErrorCorrectionLevels,
} from "../../../../../../constants/miscellaneous";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

type QRContentType = "url" | "text" | "contact" | "wifi" | "sms" | "email";

interface ContactInfo {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    organization?: string;
}

interface WifiInfo {
    ssid: string;
    password: string;
    encryption: "WPA" | "WEP" | "None";
}

interface SmsInfo {
    phone: string;
    message: string;
}

interface EmailInfo {
    address: string;
    subject?: string;
    body?: string;
}

export default function QRCodeGenerator() {
    const [contentType, setContentType] = useState<QRContentType>("url");
    const [url, setUrl] = useState("https://example.com");
    const [text, setText] = useState("Sample text for QR code");
    const [contact, setContact] = useState<ContactInfo>({
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        email: "john@example.com",
        organization: "ACME Inc",
    });
    const [wifi, setWifi] = useState<WifiInfo>({
        ssid: "MyWiFi",
        password: "securepassword",
        encryption: "WPA",
    });
    const [sms, setSms] = useState<SmsInfo>({
        phone: "+1234567890",
        message: "Hello!",
    });
    const [email, setEmail] = useState<EmailInfo>({
        address: "recipient@example.com",
        subject: "Important message",
        body: "Hello, this is an important message.",
    });
    const [qrCodeData, setQrCodeData] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [qrCodeImage, setQrCodeImage] = useState("");
    const [size, setSize] = useState(200);
    const [margin, setMargin] = useState(1);
    const [darkColor, setDarkColor] = useState("#000000");
    const [lightColor, setLightColor] = useState("#ffffff");
    const [errorCorrection, setErrorCorrection] = useState<
        "L" | "M" | "Q" | "H"
    >("M");
    const [logo, setLogo] = useState<File | null>(null);
    const [logoSize, setLogoSize] = useState(30);
    const [logoMargin, setLogoMargin] = useState(2);
    const [logoTransparent, setLogoTransparent] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateQRCode = async () => {
        try {
            let data = "";

            switch (contentType) {
                case "url":
                    data = url;
                    break;
                case "text":
                    data = text;
                    break;
                case "contact":
                    data = `BEGIN:VCARD\nVERSION:3.0\nN:${contact.lastName};${contact.firstName}\nFN:${contact.firstName} ${contact.lastName}\nTEL:${contact.phone}\nEMAIL:${contact.email}\nORG:${contact.organization}\nEND:VCARD`;
                    break;
                case "wifi":
                    const authType =
                        wifi.encryption === "None" ? "nopass" : wifi.encryption;
                    data = `WIFI:T:${authType};S:${wifi.ssid};P:${wifi.password};;`;
                    break;
                case "sms":
                    data = `SMSTO:${sms.phone}:${sms.message}`;
                    break;
                case "email":
                    let emailData = `mailto:${email.address}`;
                    const params = [];
                    if (email.subject)
                        params.push(
                            `subject=${encodeURIComponent(email.subject)}`
                        );
                    if (email.body)
                        params.push(`body=${encodeURIComponent(email.body)}`);
                    if (params.length > 0) emailData += `?${params.join("&")}`;
                    data = emailData;
                    break;
            }

            setQrCodeData(data);

            if (canvasRef.current) {
                const options = {
                    width: size,
                    margin,
                    color: {
                        dark: darkColor,
                        light: lightColor,
                    },
                    errorCorrectionLevel: errorCorrection,
                };

                await toCanvas(canvasRef.current, data, options);

                if (logo && canvasRef.current) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        const logoImg = new Image();
                        logoImg.onload = () => {
                            const logoWidth = (canvas.width * logoSize) / 100;
                            const logoHeight = (canvas.height * logoSize) / 100;
                            const x = (canvas.width - logoWidth) / 2;
                            const y = (canvas.height - logoHeight) / 2;

                            // Draw white background for logo if not transparent
                            if (!logoTransparent) {
                                ctx.fillStyle = lightColor;
                                ctx.fillRect(
                                    x - logoMargin * 2,
                                    y - logoMargin * 2,
                                    logoWidth + logoMargin * 4,
                                    logoHeight + logoMargin * 4
                                );
                            }

                            ctx.drawImage(logoImg, x, y, logoWidth, logoHeight);
                        };
                        logoImg.src = URL.createObjectURL(logo);
                    }
                }

                setQrCodeImage(canvasRef.current.toDataURL("image/png"));
            }
        } catch (err) {
            console.error("Error generating QR code:", err);
        }
    };

    useEffect(() => {
        generateQRCode();
    }, [
        contentType,
        url,
        text,
        contact,
        wifi,
        sms,
        email,
        size,
        margin,
        darkColor,
        lightColor,
        errorCorrection,
        logo,
        logoSize,
        logoMargin,
        logoTransparent,
    ]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogo(e.target.files[0]);
        }
    };

    const downloadQRCode = async () => {
        try {
            // Regenerate QR code with logo to ensure it's included
            await generateQRCode();

            // Use a small delay to ensure the logo has time to load and render
            setTimeout(() => {
                if (canvasRef.current) {
                    // Get the latest canvas data URL with the logo included
                    const dataUrl = canvasRef.current.toDataURL("image/png");
                    saveAs(dataUrl, `qr-code-${contentType}-${Date.now()}.png`);
                }
            }, 100);
        } catch (err) {
            console.error("Error downloading QR code:", err);
        }
    };

    const copyToClipboard = async () => {
        if (canvasRef.current) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        "image/png": new Promise((resolve) => {
                            canvasRef.current?.toBlob((blob) => {
                                if (blob) resolve(blob);
                                else
                                    resolve(
                                        new Blob([], { type: "image/png" })
                                    );
                            }, "image/png");
                        }) as Promise<Blob>,
                    }),
                ]);
                alert("QR code copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    const handleContactChange = (field: keyof ContactInfo, value: string) => {
        setContact((prev) => ({ ...prev, [field]: value }));
    };

    const handleWifiChange = (field: keyof WifiInfo, value: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setWifi((prev) => ({ ...prev, [field]: value as any }));
    };

    const handleSmsChange = (field: keyof SmsInfo, value: string) => {
        setSms((prev) => ({ ...prev, [field]: value }));
    };

    const handleEmailChange = (field: keyof EmailInfo, value: string) => {
        setEmail((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Settings Panel */}
                <div className="foreground shadow-inset p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white/80">
                        Settings
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                            QR Code Content Type
                        </label>
                        <Select
                            value={contentType}
                            onValueChange={(value) => {
                                setContentType(value as QRContentType);
                            }}
                        >
                            <SelectTrigger className="text-[16px]">
                                <SelectValue placeholder="Select content" />
                            </SelectTrigger>
                            <SelectContent>
                                {qrContentOptions.map((option, index) => (
                                    <SelectItem
                                        key={index}
                                        value={option.value}
                                    >
                                        {option.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {contentType === "url" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white/80 mb-1 ml-1">
                                URL
                            </label>
                            <Input
                                className="md:text-[16px]"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder=""
                            />
                        </div>
                    )}

                    {contentType === "text" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white/80 mb-1">
                                Text
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text for QR code"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                            />
                        </div>
                    )}

                    {contentType === "contact" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    First Name
                                </label>
                                <Input
                                    type="text"
                                    value={contact.firstName}
                                    onChange={(e) =>
                                        handleContactChange(
                                            "firstName",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Last Name
                                </label>
                                <Input
                                    type="text"
                                    value={contact.lastName}
                                    onChange={(e) =>
                                        handleContactChange(
                                            "lastName",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Phone
                                </label>
                                <Input
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) =>
                                        handleContactChange(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    value={contact.email}
                                    onChange={(e) =>
                                        handleContactChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Organization (Optional)
                                </label>
                                <Input
                                    type="text"
                                    value={contact.organization || ""}
                                    onChange={(e) =>
                                        handleContactChange(
                                            "organization",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {contentType === "wifi" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Network Name (SSID)
                                </label>
                                <Input
                                    type="text"
                                    value={wifi.ssid}
                                    onChange={(e) =>
                                        handleWifiChange("ssid", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    value={wifi.password}
                                    onChange={(e) =>
                                        handleWifiChange(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Encryption
                                </label>
                                <select
                                    value={wifi.encryption}
                                    onChange={(e) =>
                                        handleWifiChange(
                                            "encryption",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="WPA">WPA/WPA2</option>
                                    <option value="WEP">WEP</option>
                                    <option value="None">
                                        None (Open Network)
                                    </option>
                                </select>
                            </div>
                        </div>
                    )}

                    {contentType === "sms" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Phone Number
                                </label>
                                <Input
                                    type="tel"
                                    value={sms.phone}
                                    onChange={(e) =>
                                        handleSmsChange("phone", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Message
                                </label>
                                <textarea
                                    value={sms.message}
                                    onChange={(e) =>
                                        handleSmsChange(
                                            "message",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {contentType === "email" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    value={email.address}
                                    onChange={(e) =>
                                        handleEmailChange(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Subject (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={email.subject || ""}
                                    onChange={(e) =>
                                        handleEmailChange(
                                            "subject",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Body (Optional)
                                </label>
                                <textarea
                                    value={email.body || ""}
                                    onChange={(e) =>
                                        handleEmailChange(
                                            "body",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Size (px)
                            </label>

                            <Slider
                                defaultValue={[200]}
                                max={1000}
                                step={5}
                                onValueChange={(value) => setSize(value[0])}
                                className="w-full"
                            />
                            <div className="text-center">{size}px</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Margin
                            </label>
                            <Slider
                                defaultValue={[1]}
                                min={0}
                                max={10}
                                step={0.5}
                                onValueChange={(value) => setMargin(value[0])}
                                className="w-full"
                            />
                            <div className="text-center">{margin} modules</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Dark Color
                                </label>
                                <input
                                    type="color"
                                    value={darkColor}
                                    onChange={(e) =>
                                        setDarkColor(e.target.value)
                                    }
                                    className="w-full h-10"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">
                                    Light Color
                                </label>
                                <input
                                    type="color"
                                    value={lightColor}
                                    onChange={(e) =>
                                        setLightColor(e.target.value)
                                    }
                                    className="w-full h-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">
                                Error Correction
                            </label>
                            <Select
                                value={errorCorrection}
                                onValueChange={(value) => {
                                    setErrorCorrection(value as "L" | "M" | "Q" | "H");
                                }}
                            >
                                <SelectTrigger className="text-[16px]">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {qrErrorCorrectionLevels.map(
                                        (option, index) => (
                                            <SelectItem
                                                key={index}
                                                value={option.value}
                                            >
                                                {option.title}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4">
                            <label className="block text-sm font-medium text-white/80 mb-1">
                                Logo (Optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />

                            {logo && (
                                <div className="mt-2 space-y-2">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1">
                                            Logo Size (%)
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="50"
                                            value={logoSize}
                                            onChange={(e) =>
                                                setLogoSize(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <div className="text-center">
                                            {logoSize}%
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1">
                                            Logo Margin
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={logoMargin}
                                            onChange={(e) =>
                                                setLogoMargin(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <div className="text-center">
                                            {logoMargin}px
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="logoTransparent"
                                            checked={logoTransparent}
                                            onChange={(e) =>
                                                setLogoTransparent(
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="logoTransparent"
                                            className="ml-2 block text-sm text-white/80"
                                        >
                                            Transparent Background
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* QR Code Preview */}
                <div className="foreground shadow-inset p-6 rounded-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4 text-white/80">
                        QR Code Preview
                    </h2>

                    <div className="mb-4 p-2 foreground shadow-inset border border-gray-200 rounded">
                        <canvas
                            ref={canvasRef}
                            width={size}
                            height={size}
                            className="max-w-full h-auto"
                        />
                    </div>

                    <div className="w-full max-w-xs space-y-3">
                        <button
                            onClick={downloadQRCode}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                        >
                            Download QR Code
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                        >
                            Copy to Clipboard
                        </button>
                    </div>

                    {qrCodeData && (
                        <div className="mt-6 w-full max-w-xs">
                            <h3 className="text-sm font-medium text-white/80 mb-1">
                                Encoded Data
                            </h3>
                            <div className="p-3 bg-gray-100 rounded-md text-xs font-mono overflow-x-auto">
                                {qrCodeData}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
