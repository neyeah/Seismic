import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, refreshAccessToken } from "./utils/token";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    user_lga: "",
    user_city: "",
    user_state: "",
    user_address: "",
    phone_number: "",
    title: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      let token = localStorage.getItem("access_token");
      if (!token || isTokenExpired(token)) {
        token = await refreshAccessToken();
        if (!token) {
          navigate("/login");
        }
      }
    };
    checkToken();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      let accessToken = localStorage.getItem("access_token");

      if (isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
        if (!accessToken) {
          setError("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
      }

      const response = await fetch(
        "https://75f3-2c0f-2a80-1a-3f10-119b-51ae-7e79-a0a2.ngrok-free.app/api/v1/monitoring_evaluation/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formData,
            component_access: "COMPONENT1",
            jurisdiction: "federal",
            tc_name: "federal science and technical college, ohanso",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully", result);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          user_lga: "",
          user_city: "",
          user_state: "",
          user_address: "",
          phone_number: "",
          title: "",
          gender: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Error submitting form:", errorData);
        setError(
          `Error: ${response.status} - ${errorData.detail || errorData.message}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-400 to-gray-600 min-h-screen flex items-center justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Contact Form
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            First Name:
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1 p-3 border border-gray-300 rounded w-full focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Last Name:
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1 p-3 border border-gray-300 rounded w-full focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-3 border border-gray-300 rounded w-full focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Add remaining fields similarly */}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 px-4 rounded hover:from-gray-700 hover:to-gray-900 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormComponent;
