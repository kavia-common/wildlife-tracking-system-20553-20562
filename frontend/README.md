# Wildlife Tracking Frontend (React + Tailwind)

Ocean Professional themed frontend for tracking sloth bears.

## Features
- Authentication (Login/Register) with JWT in localStorage
- Protected routes and Logout in Navbar
- Dashboard with map (Leaflet), live positions and stats
- Bears CRUD (Add, List, Detail with movement history, Edit, Delete)
- Alerts and Manual Observations
- Axios API integration with Authorization header

## Tech
- React 18, Vite
- TailwindCSS 3
- React Router v6
- Axios
- Leaflet / React-Leaflet

## Environment
Create `.env` in this folder (do not commit secrets):

VITE_API_BASE=https://vscode-internal-26743-qa.qa01.cloud.kavia.ai:3001

The default is `http://localhost:3001` if not provided.

## Development
npm install
npm run dev

## Build
npm run build
npm run preview
