# Database

EduNexus uses a **Hybrid Database Architecture** to ensure both flexibility and data integrity:

1.  **MongoDB (NoSQL)**: Used for the **Book Catalog**. MongoDB allows for flexible metadata and varied book details (e.g., varied genres, subject tags) that don't always follow a strict schema.
2.  **SQLite (SQL)**: Used for **Users and Transactions**. SQLite (via Sequelize) provides ACID compliance, ensuring that borrowing/returning operations are secure and transactional.

## Connection

- **MongoDB**: `mongodb://127.0.0.1:27017/lms_db` (Local)
- **SQL (SQLite)**: `./database.sqlite` (Local file)

Configure these via `backend/.env`.

## Seeding

To seed the database with sample data:
```bash
node seeds/seed.js
```
