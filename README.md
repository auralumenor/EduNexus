<h1 align="center">EduNexus (LMS)</h1>

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

EduNexus is a modern, responsive, and secure open-source Library Management System designed for administrative workflows. It streamlines database operations by allowing instant catalogue modifications, user transaction histories, and dynamically hooks directly into [OpenLibrary.org](https://openlibrary.org/) to discover and preview volumes before adding them to your inventory.

## Features

- **Dynamic Catalog Discovery**: Search by **Title, Author, or ISBN**. Our system hooks into [OpenLibrary.org](https://openlibrary.org/) to fetch high-resolution covers and metadata, allowing you to cycle through subjects and discover fresh titles.
- **Role-Based Access Control (RBAC)**: Secure infrastructure with dedicated **Admin** and **Librarian** permissions.
- **Enterprise Design Language**: Premium "GlassCard" aesthetic powered by custom-themed Tailwind CSS and the Stitch design system.
- **Real-Time Dashboards**: Interactive metrics tracking circulation flux and volume spotlighting.
- **Integrated Route Guards**: Hardware acceleration for route transitions and role-based navigation shielding.
- **Secure Architecture**: 
  - JWT-based authentication
  - Role-specific API hardening (`restrictTo('admin')`)
  - Integration with Cloud MongoDB Atlas.

## Security Roles

| Role | Access Level | Description |
| :--- | :--- | :--- |
| **Admin** | Full Control | Can manage members, delete volumes, edit metadata, and access system settings. |
| **Librarian** | Operational | Can browse the catalog, manage transactions, and discover new books. Restricted from deletion. |

## Prerequisites

Before running this project, you must install:
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or Atlas Cluster)

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/auralumenor/EduNexus.git
   cd Library_Management_System
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Duplicate the `.env.example` configurations in both `server/` and `client/` directories.
   ```bash
   # Root level
   cp .env.example .env
   # Subdirectories
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```
   *(Be sure to adjust `server/.env` with your MongoDB URI and JWT_SECRET)*

4. **Launch Application:**
   From the root folder, launch the unified development environment:
   ```bash
   npm run dev
   ```
   The client will open automatically at `http://127.0.0.1:3000` while the backend runs on `http://127.0.0.1:5000`.

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
