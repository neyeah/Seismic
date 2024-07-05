// token.js
export const isTokenExpired = (token) => {
  if (!token) {
    return true; // Token is considered expired if it's not present
  }

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      throw new Error("Invalid token format");
    }
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const tokenData = JSON.parse(jsonPayload);
    const tokenExp = tokenData.exp * 1000; // Convert expiration time to milliseconds
    const currentTime = Date.now(); // Current time in milliseconds

    return currentTime > tokenExp; // Token is expired if current time is greater than expiration time
  } catch (error) {
    console.error("Error parsing token:", error);
    return true; // Consider token expired if there's an error parsing it
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      "https://75f3-2c0f-2a80-1a-3f10-119b-51ae-7e79-a0a2.ngrok-free.app/api/v1/account/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    } else {
      console.error(`Error refreshing token: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};
