// ws-server.js
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");


const port = process.env.WS_PORT || "ws://localhost:8080";
console.log(" Using WS_PORT:", process.env.WS_PORT);
const patientFormList = [];
const app = express();

app.use(
  cors({
    origin: [
      process.env.ALLOWED_ORIGIN, 
      "http://localhost:3000", // ถ้ายัง test local
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// (เผื่อ preflight OPTIONS)
//app.options("*", cors())

// Endpoint เช็คว่าเซิร์ฟเวอร์ออนไลน์ (หน้า root)
app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});

// 👉 API 1 เส้นที่ขอ: /api/status
app.get("/api/patient-list", (req, res) => {
  res.json({
    patients: patientFormList,
  });
});

// สร้าง HTTP server
const server = http.createServer(app);

// Attach WebSocket server
const wss = new WebSocket.Server({ server });

console.log(" WebSocket Server starting...");

// เมื่อมี client เชื่อม
wss.on("connection", (ws) => {
  console.log(" Client connected");

  ws.on("message", (data) => {
    console.log(" Message from client:", data.toString());
    const dataObj = JSON.parse(data.toString());
    patientFormList.push(dataObj.payload);
    // broadcast ให้ client ทุกคน
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log(" Client disconnected");
  });
});

// ต้อง listen ผ่าน HTTP server ไม่ใช่ WS โดยตรง
server.listen(port, () => {
  console.log(`WebSocket Server is running on ws://localhost:${port}`);
});
