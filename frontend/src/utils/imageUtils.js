const baseUrl = "http://localhost:3000";

export const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    const formattedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${baseUrl}${formattedPath}`;
};
