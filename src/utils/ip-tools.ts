// src/utils/ip-tools.ts

/**
 * Validates IPv4 address format
 */
export function validateIPv4(ip: string): boolean {
    const pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if (!pattern.test(ip)) return false;

    const parts = ip.split(".").map((part) => parseInt(part, 10));
    return parts.every((part) => part >= 0 && part <= 255);
}

/**
 * Validates IPv6 address format (simplified version)
 */
export function validateIPv6(ip: string): boolean {
    // This is a simplified validation for demonstration
    const pattern =
        /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
    return pattern.test(ip);
}

/**
 * Validates any IP address (IPv4 or IPv6)
 */
export function validateIP(ip: string): boolean {
    return validateIPv4(ip) || validateIPv6(ip);
}

/**
 * Determine IP version (4 or 6)
 */
export function getIPVersion(ip: string): 4 | 6 | null {
    if (validateIPv4(ip)) return 4;
    if (validateIPv6(ip)) return 6;
    return null;
}

/**
 * Check if IP is in private range
 */
export function isPrivateIP(ip: string): boolean {
    if (!validateIPv4(ip)) return false;

    const parts = ip.split(".").map((part) => parseInt(part, 10));

    // Check for private IP ranges
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 127) return true; // Loopback

    return false;
}

/**
 * Format IP geolocation data for display
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatIPData(data: any) {
    return {
        ip: data.ip,
        version: data.version || (validateIPv6(data.ip) ? "6" : "4"),
        location: `${data.city || ""}, ${data.region || ""}, ${
            data.country_name || ""
        }`
            .replace(/, ,/g, ",")
            .replace(/^,|,$/g, ""),
        coordinates:
            data.latitude && data.longitude
                ? `${data.latitude}, ${data.longitude}`
                : "N/A",
        isp: data.org || data.isp || "N/A",
        timezone: data.timezone || "N/A",
        asn: data.asn || "N/A",
    };
}

/**
 * Get hostname from IP address (reverse DNS)
 * Note: In a real implementation, this would use DNS resolution
 */
export async function getHostname(ip: string): Promise<string> {
    try {
        // This is a placeholder. In a real app, you'd use a proper DNS resolver
        // or an API that provides reverse DNS lookups
        return `hostname-for-${ip}.example.com`;
    } catch (error) {
        console.error(error);
        return "Unknown";
    }
}
