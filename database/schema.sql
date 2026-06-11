-- ============================================================
-- Library Management System — Conceptual Schema (Reference Only)
-- This project uses MongoDB/Mongoose, NOT a relational database.
-- This file documents the data shape for reference purposes.
-- ============================================================

-- Users (admin / librarian accounts)
-- Collection: users
CREATE TABLE users (
  id            VARCHAR(24)   PRIMARY KEY,  -- MongoDB ObjectId
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password      VARCHAR(255)  NOT NULL,     -- bcrypt hash
  role          VARCHAR(20)   NOT NULL DEFAULT 'librarian', -- 'admin' | 'librarian'
  reset_password_token   VARCHAR(255),
  reset_password_expire  TIMESTAMP,
  created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Books
-- Collection: books
CREATE TABLE books (
  id              VARCHAR(24)   PRIMARY KEY,
  title           VARCHAR(255)  NOT NULL,
  author          VARCHAR(255)  NOT NULL,
  isbn            VARCHAR(20)   NOT NULL UNIQUE,
  genre           VARCHAR(100),
  description     TEXT,
  cover_image     TEXT,
  total_copies    INT           NOT NULL DEFAULT 1,
  available_copies INT          NOT NULL DEFAULT 1,
  published_year  INT,
  publisher       VARCHAR(255),
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Members (library patrons)
-- Collection: members
CREATE TABLE members (
  id              VARCHAR(24)   PRIMARY KEY,
  name            VARCHAR(100)  NOT NULL,
  email           VARCHAR(255)  NOT NULL UNIQUE,
  phone           VARCHAR(20),
  membership_id   VARCHAR(20)   NOT NULL UNIQUE,
  membership_type VARCHAR(20)   NOT NULL DEFAULT 'basic', -- 'basic' | 'premium'
  status          VARCHAR(20)   NOT NULL DEFAULT 'active', -- 'active' | 'suspended' | 'expired'
  joined_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Transactions (borrow / return records)
-- Collection: transactions
CREATE TABLE transactions (
  id              VARCHAR(24)   PRIMARY KEY,
  book_id         VARCHAR(24)   NOT NULL REFERENCES books(id),
  member_id       VARCHAR(24)   NOT NULL REFERENCES members(id),
  borrowed_date   TIMESTAMP     NOT NULL DEFAULT NOW(),
  due_date        TIMESTAMP     NOT NULL,
  returned_date   TIMESTAMP,
  status          VARCHAR(20)   NOT NULL DEFAULT 'borrowed', -- 'borrowed' | 'returned' | 'overdue'
  fine            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);
