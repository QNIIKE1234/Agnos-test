// agnos/src/app/patient-form/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

interface PatientFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  preferredLanguage: string;
  nationality: string;
  emergencyContact: string;
  religion: string;
}

const PatientForm: React.FC = () => {
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    address: "",
    preferredLanguage: "",
    nationality: "",
    emergencyContact: "",
    religion: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // เก็บ instance ของ WebSocket ไว้
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // กันไม่ให้รันตอน SSR (เผื่อ Next งอแง)
    if (typeof window === "undefined") return;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

    let socket: WebSocket | null = null;

    try {
      socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Patient WS connected");
      };

      socket.onerror = (err) => {
        console.error("Patient WS error:", err);
      };

      socket.onclose = () => {
        console.log("Patient WS disconnected");
      };
    } catch (e) {
      console.error("Error creating WebSocket on PatientForm:", e);
    }

    // cleanup
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected, cannot send form data");
      setStatusMessage("Failed to send data: WebSocket is not connected.");
      return;
    }

    setIsSending(true);
    setStatusMessage(null);

    const message = {
      type: "PATIENT_FORM",
      payload: formData,
    };

    try {
      socket.send(JSON.stringify(message));
      console.log("Sent via WS:", message);
      setStatusMessage("Form submitted successfully.");

      // ถ้าอยากเคลียร์ฟอร์มหลังส่ง:
      // setFormData({
      //   firstName: "",
      //   middleName: "",
      //   lastName: "",
      //   dateOfBirth: "",
      //   gender: "",
      //   phoneNumber: "",
      //   email: "",
      //   address: "",
      //   preferredLanguage: "",
      //   nationality: "",
      //   emergencyContact: "",
      //   religion: "",
      // });
    } catch (err) {
      console.error("Error sending WS message:", err);
      setStatusMessage("Error while sending data.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 md:p-10 max-w-lg w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-4 sm:mb-6">
          Patient Form
        </h1>

        {statusMessage && (
          <div className="mb-4 text-sm text-center text-gray-700 bg-gray-100 border border-gray-200 rounded-md py-2 px-3">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* First Name */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Middle Name */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="middleName"
            >
              Middle Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="middleName"
              name="middleName"
              type="text"
              placeholder="Enter your middle name"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="dateOfBirth"
            >
              Date of Birth
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="gender"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm bg-white"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="address"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm min-h-[70px]"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="preferredLanguage"
            >
              Preferred Language
            </label>
            <input
              id="preferredLanguage"
              name="preferredLanguage"
              type="text"
              placeholder="Enter preferred language"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              value={formData.preferredLanguage}
              onChange={handleChange}
            />
          </div>

          {/* Nationality */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="nationality"
            >
              Nationality
            </label>
            <input
              id="nationality"
              name="nationality"
              type="text"
              placeholder="Enter nationality"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              value={formData.nationality}
              onChange={handleChange}
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="emergencyContact"
            >
              Emergency Contact
            </label>
            <input
              id="emergencyContact"
              name="emergencyContact"
              type="text"
              placeholder="Name / Phone number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              value={formData.emergencyContact}
              onChange={handleChange}
            />
          </div>

          {/* Religion */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2"
              htmlFor="religion"
            >
              Religion
            </label>
            <input
              id="religion"
              name="religion"
              type="text"
              placeholder="Enter religion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              value={formData.religion}
              onChange={handleChange}
            />
          </div>

          {/* Submit button */}
          <button
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            type="submit"
            disabled={isSending}
          >
            {isSending ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
