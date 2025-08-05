
const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
};

const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift() ?? '';
        return decodeURIComponent(cookieValue);
    }
    return undefined;
};

const deleteCookie = (name: string) => {
    setCookie(name, '', -1);
};

const parseToken = (token: string) => {
    if (!token) return null;
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error("Failed to parse token:", error);
        return null;
    }
}

export { setCookie, getCookie, deleteCookie , parseToken };