export const siteConfig = {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api",
    theme: (process.env.NEXT_PUBLIC_THEME || "light").trim().toLowerCase() === "dark" ? "dark" : "light",
}
