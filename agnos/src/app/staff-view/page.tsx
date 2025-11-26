"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface PatientData {
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

interface PatientRecord {
  id: string;
  data: PatientData;
  receivedAt: string;
}

const StaffView = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"connecting" | "open" | "closed">(
    "connecting"
  );

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

    fetch(`${WS_URL}/api/patient-list`)
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to fetch patient list");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        console.log("Received patient list:", data.patients);

        const list = data.patients as PatientData[];

        const initialRecords: PatientRecord[] = list.map((p, index) => ({
          id: `init-${index}-${Date.now()}`,
          data: p,
          receivedAt: new Date().toLocaleString(),
        }));

        setPatients(initialRecords);
      })
      .catch((err) => console.error("Error fetching patient list:", err));

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Staff WS connected");
      setStatus("open");
    };

    socket.onclose = () => {
      console.log("Staff WS disconnected");
      setStatus("closed");
    };

    socket.onerror = (err) => {
      console.error("Staff WS error:", err);
      setStatus("closed");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "PATIENT_FORM") {
          const payload = data.payload as PatientData;

          const newRecord: PatientRecord = {
            id: `${Date.now()}-${Math.random()}`,
            data: payload,
            receivedAt: new Date().toLocaleString(),
          };

          setPatients((prev) => [newRecord, ...prev]);
          console.log("Received patient data:", payload);
        } else {
          console.log("Unknown message:", data);
        }
      } catch (err) {
        console.error("Error parsing message", err);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const selectedPatient = patients.find((p) => p.id === selectedId) || null;

  if (patients.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 md:p-10 max-w-lg w-full text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
            Patient Data
          </h1>
          <p className="text-gray-600 mb-2">
            {status === "connecting" && "Connecting to WebSocket..."}
            {status === "open" &&
              "Waiting for patient form submission via WebSocket..."}
            {status === "closed" &&
              "WebSocket disconnected. Please check server connection."}
          </p>
          <Link
            href="/home"
            className="inline-block mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 md:p-10 max-w-4xl w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
            Patient List
          </h1>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                status === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              WS: {status.toUpperCase()}
            </span>
            <Link
              href="/home"
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* List */}
          <div className="md:col-span-1 border-r pr-0 md:pr-4">
            <h2 className="font-semibold text-gray-700 mb-2">Patients</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {patients.map((p) => {
                const fullName = `${p.data.firstName} ${
                  p.data.middleName ? p.data.middleName + " " : ""
                }${p.data.lastName}`;

                const isSelected = p.id === selectedId;

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left p-2 rounded-lg border text-sm ${
                      isSelected
                        ? "bg-blue-50 border-blue-400"
                        : "bg-gray-50 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-semibold text-gray-800">
                      {fullName || "Unnamed Patient"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Received: {p.receivedAt}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <h2 className="font-semibold text-gray-700 mb-2">Details</h2>

            {!selectedPatient && (
              <div className="text-gray-500 text-sm">
                เลือกคนไข้จากด้านซ้ายเพื่อดูรายละเอียด
              </div>
            )}

            {selectedPatient && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {`${selectedPatient.data.firstName} ${
                        selectedPatient.data.middleName
                          ? selectedPatient.data.middleName + " "
                          : ""
                      }${selectedPatient.data.lastName}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      Received: {selectedPatient.receivedAt}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {Object.entries(selectedPatient.data).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="font-semibold text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffView;
