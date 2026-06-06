<h1 align="center">Digital Curator (LMS)</h1>

<p align="center">
  <strong>An Enterprise-Grade Library Management System built with React, Node.js, and Tailwind CSS.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue" alt="React 18" />
  <img src="https://img.shields.io/badge/Express-Node.js-green" alt="Express/Node.js" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-4DB33D" alt="MongoDB" />
  <img src="https://img.shields.io/badge/License-MIT-gray" alt="License: MIT" />
</p>

## Overview

Digital Curator is a modern, responsive, and secure open-source Library Management System designed for administrative workflows. It streamlines database operations by allowing instant catalogue modifications, user transaction histories, and dynamically hooks directly into [OpenLibrary.org](https://openlibrary.org/) to autofill physical inventory data natively via ISBN fetching.

## Features

- **Dynamic Book Discovery**: Search by **Title, Author, or ISBN**. Our system dynamically hooks into [OpenLibrary.org](https://openlibrary.org/) to fetch high-quality covers, publishers, and metadata to auto-fill your inventory.
- **Enterprise Design Language**: Premium "GlassCard" aesthetic powered by custom-themed Tailwind CSS.
- **Dedicated User Profile**: Decoupled profile management featuring secure credential updates and a controlled account deletion "Danger Zone".
- **Interactive Tooltips**: Intelligent micro-interactions with a 4-second hover delay for contextual guidance without UI clutter.
- **System Synchronization**: Native `Light | Dark | System` theme management that syncs automatically with your OS environment.
- **Custom UI Components**: Hand-crafted accessible dropdowns, modals, and tailored slim-scrollbars for a cohesive experience.
- **Secure Architecture**: 
  - JWT-based authentication
  - Password hashing via `bcrypt`
  - Integrated `nodemailer` support for SMTP-based account recovery.

## Prerequisites

Before running this project, you must install:
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or Atlas Cluster)

*(Note: In development environments, the system features a robust fallback script that will automatically spin up an in-memory `mongodb-memory-server` if you do not have a Docker/local daemon running!)*

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/digital-curator.git
   cd digital-curator
   ```

2. **Install Dependencies:**
   ```bash
   npm install --prefix client
   npm install --prefix server
   npm install
   ```

3. **Environment Setup:**
   Duplicate the `.env.example` configurations.
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```
   *(Be sure to adjust `server/.env` with your desired MongoDB routing and arbitrary secret key)*

4. **Launch Application:**
   From the root folder, utilize the concurrent environment runner to rapidly spawn both the Vite bundler and local Node server:
   ```bash
   npm start
   ```
   The client will open automatically at `http://localhost:3000` mapped to intercept your API traffic over `http://localhost:5000`.

## Directory Structure

```text
├── client/                 # React frontend powered by Vite
│   ├── src/
│   │   ├── components/     # Scalable UI logic (Buttons, Inputs, Cards)
│   │   ├── context/        # Core hooks (AuthContext, ThemeContext)
│   │   ├── pages/          # Primary SPA application routes
│   │   ├── services/       # Functional bindings intercepting backend APIs
├── server/                 # Express REST endpoint
│   ├── src/
│   │   ├── config/         # In-memory MongoDB fallbacks & standard boot routing
│   │   ├── modules/        # Modular service controllers (Auth, Books, Users, Transactions)
│   │   ├── utils/          # Operational dependencies (Email via Nodemailer)
```

## Contributing

We welcome community engagement! If you would like to contribute:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request.

## Acknowledgements

- **OpenLibrary.org**: For providing public-domain cataloging infrastructure.
- **Tailwind Labs**: For revolutionizing inline styling mechanisms.
- *For further project attribution tracking, please see `acknowledgements.md` in root.*
