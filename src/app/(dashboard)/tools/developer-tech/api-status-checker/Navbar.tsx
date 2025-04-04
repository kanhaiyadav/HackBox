"use client";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-8 w-8 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h1 className="text-xl font-bold text-white">
                                API Status
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <a
                            href="#"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Dashboard
                        </a>
                        <a
                            href="#"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Settings
                        </a>
                        <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                            Documentation
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
