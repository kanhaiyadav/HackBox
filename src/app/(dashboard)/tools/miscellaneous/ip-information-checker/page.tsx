'use client';

// src/pages/index.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface IPDetails {
  ip: string;
  version: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  continent_name: string;
  continent_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  asn: string;
  org: string;
  isp: string;
  currency: string;
  currency_code: string;
  calling_code: string;
  is_proxy: boolean;
  is_hosting: boolean;
  is_mobile: boolean;
}

export default function IPLookup() {
  const [ipAddress, setIpAddress] = useState<string>('');
  const [ipDetails, setIpDetails] = useState<IPDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('basic');

  const validateIP = (ip: string): boolean => {
    // IPv4 validation
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if (ipv4Pattern.test(ip)) {
      return ip.split('.').every(octet => parseInt(octet) <= 255);
    }
    
    // IPv6 validation (simplified)
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
    return ipv6Pattern.test(ip);
  };

  const lookupIP = async () => {
    if (!ipAddress.trim()) {
      setError('Please enter an IP address');
      return;
    }

    if (!validateIP(ipAddress)) {
      setError('Invalid IP address format');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For this example, we'll use the ipapi.co service
      const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
      setIpDetails(response.data);
      
      // Add to history if not already present
      if (!history.includes(ipAddress)) {
        setHistory(prev => [ipAddress, ...prev].slice(0, 10));
      }
    } catch (err) {
      setError('Failed to fetch IP details. Please try again.');
      console.error('Error fetching IP details:', err);
    } finally {
      setLoading(false);
    }
  };

  const lookupMyIP = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      setIpAddress(response.data.ip);
      
      // Lookup the obtained IP address
      const detailsResponse = await axios.get(`https://ipapi.co/${response.data.ip}/json/`);
      setIpDetails(detailsResponse.data);
      
      // Add to history if not already present
      if (!history.includes(response.data.ip)) {
        setHistory(prev => [response.data.ip, ...prev].slice(0, 10));
      }
    } catch (err) {
      setError('Failed to fetch your IP address. Please try again.');
      console.error('Error fetching IP:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-2">IP Address Lookup</h1>
        <p className="text-gray-600 text-center mb-8">Get detailed information about any IP address</p>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Enter IP address (e.g., 8.8.8.8 or 2001:4860:4860::8888)"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={lookupIP}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              {loading ? 'Loading...' : 'Lookup IP'}
            </button>
            <button
              onClick={lookupMyIP}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              My IP
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showHistory ? 'Hide Search History' : 'Show Search History'}
            </button>
            
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear History
              </button>
            )}
          </div>
          
          {showHistory && history.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-md font-semibold mb-2">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {history.map((ip, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIpAddress(ip);
                      setShowHistory(false);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {ip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {ipDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{ipDetails.ip}</h2>
              <p className="text-gray-600">IPv{ipDetails.version} Address</p>
            </div>
            
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'basic' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setActiveTab('basic')}
                >
                  Basic Info
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'location' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setActiveTab('location')}
                >
                  Location
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'network' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setActiveTab('network')}
                >
                  Network
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'other' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setActiveTab('other')}
                >
                  Other Details
                </button>
              </div>
              
              <div className="mt-4">
                {activeTab === 'basic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="IP Address" value={ipDetails.ip} />
                    <InfoItem label="IP Version" value={`IPv${ipDetails.version}`} />
                    <InfoItem label="Country" value={`${ipDetails.country_name} (${ipDetails.country_code})`} />
                    <InfoItem label="City" value={`${ipDetails.city}, ${ipDetails.region}`} />
                    <InfoItem label="Timezone" value={ipDetails.timezone} />
                    <InfoItem label="UTC Offset" value={ipDetails.utc_offset} />
                  </div>
                )}
                
                {activeTab === 'location' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <InfoItem label="Continent" value={`${ipDetails.continent_name} (${ipDetails.continent_code})`} />
                      <InfoItem label="Country" value={`${ipDetails.country_name} (${ipDetails.country_code})`} />
                      <InfoItem label="Region/State" value={ipDetails.region} />
                      <InfoItem label="City" value={ipDetails.city} />
                      <InfoItem label="Latitude" value={ipDetails.latitude.toString()} />
                      <InfoItem label="Longitude" value={ipDetails.longitude.toString()} />
                    </div>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Map preview would be displayed here</p>
                      {/* In a real implementation, you would integrate a map here */}
                    </div>
                  </div>
                )}
                
                {activeTab === 'network' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="ASN" value={ipDetails.asn} />
                    <InfoItem label="Organization" value={ipDetails.org} />
                    <InfoItem label="ISP" value={ipDetails.isp} />
                    <InfoItem label="Proxy/VPN" value={ipDetails.is_proxy ? 'Yes' : 'No'} highlight={ipDetails.is_proxy} />
                    <InfoItem label="Hosting" value={ipDetails.is_hosting ? 'Yes' : 'No'} />
                    <InfoItem label="Mobile Network" value={ipDetails.is_mobile ? 'Yes' : 'No'} />
                  </div>
                )}
                
                {activeTab === 'other' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Currency" value={`${ipDetails.currency} (${ipDetails.currency_code})`} />
                    <InfoItem label="Calling Code" value={ipDetails.calling_code} />
                    <InfoItem label="Timezone" value={ipDetails.timezone} />
                    <InfoItem label="UTC Offset" value={ipDetails.utc_offset} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(ipDetails, null, 2));
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
              >
                Copy as JSON
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Print
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const InfoItem = ({ label, value, highlight = false }: InfoItemProps) => (
  <div className="border-b border-gray-100 pb-2">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`font-medium ${highlight ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
  </div>
);