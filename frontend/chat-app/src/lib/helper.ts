
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

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const getMapUrls = (location: { lat: number | undefined; lng: number | undefined }) => {
    if (!location?.lat || !location?.lng) {
        return { primary: '#', fallback: '#' };
    }
    const neshanApp = `neshan://map?lat=${location.lat}&lon=${location.lng}`;
    const neshanWeb = `https://neshan.org/maps/@${location.lat},${location.lng},15z`;
    const googleMaps = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
    return {
        primary: isMobile() ? neshanApp : neshanWeb,
        fallback: googleMaps,
    };
};

// Function to refresh the access token
async function refreshAccessToken() {
  try {
    // Replace with your actual refresh token API endpoint
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_DEVELOPMENT}/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;
    const expiresInSeconds = import.meta.env.VITE_ACCESS_TOKEN_EXPIRES_IN_SECONDS;

    // Update the cookie with the new access token
    setCookie('accessToken', newAccessToken, expiresInSeconds);

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    // Handle token refresh failure (e.g., redirect to login)
    window.location.href = '/login';
  }
}


export { setCookie, getCookie, deleteCookie, parseToken, getMapUrls, isMobile , refreshAccessToken };