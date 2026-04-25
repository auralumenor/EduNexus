# Database

This project uses **MongoDB** (via Mongoose ODM) — a NoSQL document database. The `schema.sql` file and `migrations/` directory are placeholders retained for structural reference; they are not used.

## Collections

| Collection | Description |
|---|---|
| `users` | Admin/librarian accounts (bcrypt-hashed passwords) |
| `books` | Book catalog with copy tracking |
| `members` | Library member records |
| `transactions` | Borrow/return records with due dates and fines |

## Seeding

To seed the database with sample data, run (once server and MongoDB are running):
```bash
node seeds/seed.js
```

## Connection
MongoDB runs at `mongodb+srv://Lumenor:d5b6ad144152@cluster0.efsvv3x.mongodb.net/lms_db?appName=Cluster0` (Atlas Cluster).  
Configure via `backend/.env` → `MONGO_URI`.
