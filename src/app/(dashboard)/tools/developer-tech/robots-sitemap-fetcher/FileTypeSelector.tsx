// components/FileTypeSelector.tsx
import React from "react";

interface FileSelectorProps {
    fileType: "robots" | "sitemap";
    setFileType: (type: "robots" | "sitemap") => void;
}

const FileTypeSelector: React.FC<FileSelectorProps> = ({
    fileType,
    setFileType,
}) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">File Type</label>
            <div className="flex space-x-4">
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="robots"
                        name="fileType"
                        value="robots"
                        checked={fileType === "robots"}
                        onChange={() => setFileType("robots")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                    />
                    <label htmlFor="robots" className="ml-2 block text-sm">
                        robots.txt
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="sitemap"
                        name="fileType"
                        value="sitemap"
                        checked={fileType === "sitemap"}
                        onChange={() => setFileType("sitemap")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                    />
                    <label htmlFor="sitemap" className="ml-2 block text-sm">
                        sitemap.xml
                    </label>
                </div>
            </div>
        </div>
    );
};

export default FileTypeSelector;
