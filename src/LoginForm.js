import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://75f3-2c0f-2a80-1a-3f10-119b-51ae-7e79-a0a2.ngrok-free.app/api/v1/account/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        navigate("/form");
      } else {
        const errorData = await response.text();
        setError(`Error: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      setError("Error logging in. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 px-4 rounded hover:from-gray-700 hover:to-gray-900 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
