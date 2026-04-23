# Safari & City Discovery MVP

A luxury destination discovery platform for Southern Africa, built with Vite, Express, React, and Tailwind CSS.

## Features
- **Dynamic Destination Pages**: Cape Town, Johannesburg, and Botswana.
- **Full-Stack Logging**: Page views are logged to MongoDB via an Express API.
- **Trip Builder Flow**: Seamlessly select packages and stays to start building your trip.
- **Responsive Design**: Mobile-first approach with polished animations using `motion`.
- **Luxury UI**: Dark-themed, high-end aesthetic inspired by premium travel brands.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Shadcn/UI, Lucide React, Motion.
- **Backend**: Express.js, MongoDB.
- **Routing**: React Router 7.

## Setup & Development

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB (optional, for page view logging)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file based on `.env.example`:
   ```env
   MONGODB_URI="your_mongodb_connection_string"
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Code Architecture (NVM Pattern)
The project follows a modular architecture:
- `src/components`: Reusable UI components.
- `src/pages`: Page-level components.
- `src/lib`: Shared utilities and data.
- `server.ts`: Express server handling both API and Vite middleware.

## Deployment
This app is ready for deployment to platforms like Vercel or Cloud Run.
- Build command: `npm run build`
- Start command: `npm run start`
