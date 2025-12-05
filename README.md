# README

## Project Setup Guide

## 1. Initialize Project

```
npm init -y
npm i typescript
npx tsc --init
```

---

## 2. Install Express

**Reference:** expressjs.com/en/starter/installing.html

```
npm install express
npm i --save-dev @types/express
```

---

## 3. Run TypeScript with TSX

**Reference:** nodejs.org/en/learn/typescript/run

```
npm i -D tsx
```

---

## 4. Install PostgreSQL Client (pg)

**Reference:** npmjs.com/package/pg

```
npm i pg
```

---

## 5. Neon DB URL

Use your Neon PostgreSQL dashboard:
`https://console.neon.tech/app/projects/ancient-firefly-38214070?branchId=br-tiny-cloud-a41tbzxh&database=neondb`

Configure environment variable:

```
DATABASE_URL="your-neon-connection-url"
```
