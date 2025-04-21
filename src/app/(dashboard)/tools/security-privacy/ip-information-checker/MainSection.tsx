"use client";

import React, { useState } from "react";
import IpForm from "./IpForm";
import { IPDetails } from "@/types/micellaneous";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const MainSection = () => {
    const [ipDetails, setIpDetails] = useState<IPDetails | null>(null);
    const [activeTab, setActiveTab] = useState<string>("basic");

    return (
        <div className="pb-[1px]">
            <IpForm setDetails={setIpDetails} />

            {ipDetails && (
                <div className="foreground shadow-inset rounded-lg p-6 mb-6">
                    <div className="border-b-2 border-accent pb-4 mb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-white/80">
                                {ipDetails.ip}
                            </h2>
                            <span
                                className="text-2xl"
                                title={`Flag of ${ipDetails.country}`}
                            >
                                {ipDetails.flag.emoji}
                            </span>
                        </div>
                        <p className="text-white/60">
                            {ipDetails.type} Address
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex border-b border-accent overflow-x-auto overflow-y-hidden">
                            <button
                                className={`px-4 py-2 font-medium ${
                                    activeTab === "basic"
                                        ? "text-primary border-b-2 border-primary/80"
                                        : "text-white/60 hover:text-primary/80"
                                } relative bottom-[-1px]`}
                                onClick={() => setActiveTab("basic")}
                            >
                                Basic Info
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${
                                    activeTab === "location"
                                        ? "text-primary border-b-2 border-primary/80"
                                        : "text-white/60 hover:text-primary/80"
                                } relative bottom-[-1px]`}
                                onClick={() => setActiveTab("location")}
                            >
                                Location
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${
                                    activeTab === "network"
                                        ? "text-primary border-b-2 border-primary/80"
                                        : "text-white/60 hover:text-primary/80"
                                } relative bottom-[-1px]`}
                                onClick={() => setActiveTab("network")}
                            >
                                Network
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${
                                    activeTab === "country"
                                        ? "text-primary border-b-2 border-primary/80"
                                        : "text-white/60 hover:text-primary/80"
                                } relative bottom-[-1px]`}
                                onClick={() => setActiveTab("country")}
                            >
                                Country Info
                            </button>
                        </div>

                        <div className="mt-4">
                            {activeTab === "basic" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem
                                        label="IP Address"
                                        value={ipDetails.ip}
                                    />
                                    <InfoItem
                                        label="IP Version"
                                        value={`${ipDetails.type}`}
                                    />
                                    <InfoItem
                                        label="Country"
                                        value={`${ipDetails.country} (${ipDetails.country_code})`}
                                    />
                                    <InfoItem
                                        label="City"
                                        value={`${ipDetails.city}, ${ipDetails.region}`}
                                    />
                                    <InfoItem
                                        label="Timezone"
                                        value={ipDetails.timezone.id}
                                    />
                                    <InfoItem
                                        label="UTC Offset"
                                        value={ipDetails.timezone.offset}
                                    />
                                    <InfoItem
                                        label="Postal Code"
                                        value={ipDetails.postal || "N/A"}
                                    />
                                </div>
                            )}

                            {activeTab === "location" && (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <InfoItem
                                            label="Continent"
                                            value={`${ipDetails.continent} (${ipDetails.continent_code})`}
                                        />
                                        <InfoItem
                                            label="Country"
                                            value={`${ipDetails.continent_code} (${ipDetails.country_code})`}
                                        />
                                        <InfoItem
                                            label="Region/State"
                                            value={ipDetails.region || "N/A"}
                                        />
                                        <InfoItem
                                            label="City"
                                            value={ipDetails.city || "N/A"}
                                        />
                                        <InfoItem
                                            label="Latitude"
                                            value={ipDetails.latitude.toString()}
                                        />
                                        <InfoItem
                                            label="Longitude"
                                            value={ipDetails.longitude.toString()}
                                        />
                                        <InfoItem
                                            label="Coordinates"
                                            value={`${ipDetails.latitude}, ${ipDetails.longitude}`}
                                        />
                                        <InfoItem
                                            label="Map Link"
                                            value={
                                                <a
                                                    href={`https://maps.google.com/?q=${ipDetails.latitude},${ipDetails.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    View on Google Maps
                                                </a>
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === "network" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem
                                        label="ASN"
                                        value={
                                            ipDetails.connection.asn || "N/A"
                                        }
                                    />
                                    <InfoItem
                                        label="Organization"
                                        value={
                                            ipDetails.connection.org || "N/A"
                                        }
                                    />
                                    <InfoItem
                                        label="ISP"
                                        value={
                                            ipDetails.connection.isp || "N/A"
                                        }
                                    />
                                </div>
                            )}

                            {activeTab === "country" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-b border-accent pb-2">
                                        <p className="text-sm text-gray-500">
                                            Country
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p>
                                                {ipDetails.country} (
                                                {ipDetails.country_code})
                                            </p>
                                            <Image
                                                src={ipDetails.flag.img}
                                                alt="Country Flag"
                                                width={20}
                                                height={10}
                                            />
                                        </div>
                                    </div>
                                    <InfoItem
                                        label="Continent"
                                        value={`${ipDetails.continent} (${ipDetails.continent_code})`}
                                    />
                                    <InfoItem
                                        label="Calling Code"
                                        value={`+${ipDetails.calling_code}`}
                                    />
                                    <InfoItem
                                        label="Capital"
                                        value={ipDetails.capital || "N/A"}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    JSON.stringify(ipDetails, null, 2)
                                );
                            }}
                            // className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                        >
                            Copy as JSON
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface InfoItemProps {
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
}

const InfoItem = ({ label, value, highlight = false }: InfoItemProps) => (
    <div className="border-b border-accent pb-2">
        <p className="text-sm text-gray-500">{label}</p>
        <p
            className={`font-medium ${
                highlight ? "text-red-600" : "text-white/80"
            }`}
        >
            {value}
        </p>
    </div>
);

export default MainSection;
