# Simple Logistic App Backend

Simple logistic app backend with Node.js, TypeScript, and Prisma ORM

## Requirement

- [Node.js](https://nodejs.org/)
- [PSQL](www.postgresql.org)

## Setup and Run

1. Clone this repository to your machine
2. Copy .env.example file, rename it to .env, then adjust the value as needed
3. Install dependencies:
   ```shell
   npm install
   ```
4. Migrate database:
   ```shell
   npm run prisma:migrate
   ```
5. Running the app on your device:
   ```shell
   npm run dev
   ```
