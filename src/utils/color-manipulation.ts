// utils/getShareUrl.ts
export const getShareUrl = (platform: string, url: string, text: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    switch (platform) {
        case "whatsapp":
            return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        case "twitter":
            return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        case "facebook":
            return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        case "linkedin":
            return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        case "instagram":
            // No official Instagram web share link. Provide instructions or copy link.
            return "https://www.instagram.com"; // fallback
        default:
            return url;
    }
};
