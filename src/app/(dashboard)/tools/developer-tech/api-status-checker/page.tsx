// File: app/page.tsx
import StatusDashboard from "./StatusDashboard";

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-900 text-gray-100">
            <StatusDashboard />
        </main>
    );
}
