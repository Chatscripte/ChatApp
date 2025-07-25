
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

export { setCookie, getCookie, deleteCookie };