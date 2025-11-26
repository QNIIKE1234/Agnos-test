# AGNOS Realtime WebSocket Server

Backend system for AGNOS Patient & Staff real-time interface, built with
Node.js (Express) + WebSocket (`ws`), deployed on Railway, and connected to a front-end deployed on Vercel.

Designed for instant updates between Patient Form UI and Staff View Dashboard.


## Frontend Links
| Role | URL |
|------|-----|
| Patient Form | https://agnos-test-rose.vercel.app/patient-form |
| Staff View |https://agnos-test-rose.vercel.app/staff-view|
| Home | https://agnos-test-rose.vercel.app/home|


## WebSocket Endpoint

Production:

wss://agnos-test-production.up.railway.app


Local Development:

ws://localhost:8080


Note: `wss://` is required for secure WebSocket connection from Vercel frontend.


## Tech Stack

| Component        | Technology |
|------------------|------------|
| Backend Server   | Node.js (Express + ws) |
| Realtime Engine  | WebSocket |
| Deployment (Backend) | Railway |
| Deployment (Frontend) | Vercel |
| Environment      | dotenv |
| Language         | JavaScript |


## Local Development

```bash
npm install
npm start


WebSocket available at:

ws://localhost:8080


---

## Environment Variables

env
PORT=8080
ALLOWED_ORIGIN=https://agnos-test-git-main-qniike1234s-projects.vercel.app



## Deployment — Railway

`railway.toml`:
toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"

`package.json` scripts:
json
"scripts": {
  "start": "node server.js"
}


## WebSocket Client Example

js
const ws = new WebSocket("wss://agnos-test-production.up.railway.app");

ws.onopen = () => console.log("Connected to AGNOS server");
ws.onmessage = (event) => console.log("Message:", JSON.parse(event.data));
ws.onerror = (err) => console.error("WebSocket error:", err);
ws.onclose = () => console.log("WebSocket disconnected");




## TODO Improvements

- WebSocket authentication (JWT / token-based)
- Add logging (e.g., Winston / Sentry)
- Scalability improvements (PM2 / clustering)



## Developer

Teerapat (Qniike1234)  
Game Developer & Software Engineer


