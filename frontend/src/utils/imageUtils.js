// const baseUrl = "http://localhost:3000";
const baseUrl = import.meta.env.VITE_API_URL;

export const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    const formattedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${baseUrl}${formattedPath}`;
};
