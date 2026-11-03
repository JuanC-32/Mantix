-- Run once in MySQL Workbench with an administrator account.
-- Replace the password placeholder with a strong password before execution.
CREATE DATABASE IF NOT EXISTS mantix
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'mantix_app'@'localhost'
    IDENTIFIED BY 'REPLACE_WITH_A_STRONG_PASSWORD';

GRANT SELECT, INSERT, UPDATE, DELETE
    ON mantix.* TO 'mantix_app'@'localhost';
