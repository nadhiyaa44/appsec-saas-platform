# AppSec Security Threat Intelligence API Documentation

The AppSec backend is built with Express.js, TypeScript, and Prisma. It is hardened against common OWASP vulnerabilities and uses JWT auth, input validation with Zod, Helmet security headers, CORS protection, and strict rate limits.

---

## Authentication Endpoints

### 1. Register User
- **Route**: `POST /api/auth/register`
- **Rate Limit**: 20 requests per 15 minutes
- **Request Body**:
  ```json
  {
    "name": "Security Analyst",
    "email": "analyst@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "c1a84f33-149b-43d9-9599-23fbe25712e0",
      "name": "Security Analyst",
      "email": "analyst@example.com",
      "role": "Free",
      "joinedAt": "2026-07-11T16:00:00.000Z"
    }
  }
  ```

### 2. Login User
- **Route**: `POST /api/auth/login`
- **Rate Limit**: 20 requests per 15 minutes
- **Request Body**:
  ```json
  {
    "email": "analyst@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "c1a84f33-149b-43d9-9599-23fbe25712e0",
      "name": "Security Analyst",
      "email": "analyst@example.com",
      "role": "Free",
      "joinedAt": "2026-07-11T16:00:00.000Z"
    }
  }
  ```

### 3. Get Authenticated User Profile
- **Route**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "id": "c1a84f33-149b-43d9-9599-23fbe25712e0",
    "name": "Security Analyst",
    "email": "analyst@example.com",
    "role": "Free",
    "joinedAt": "2026-07-11T16:00:00.000Z"
  }
  ```

---

## Scan Endpoints

### 1. Execute Security Scan
- **Route**: `POST /api/scans/run`
- **Headers**: `Authorization: Bearer <token>`
- **Rate Limit**: 10 scans per hour
- **Request Body**:
  ```json
  {
    "url": "https://play.google.com/store/apps/details?id=com.instagram.android"
  }
  ```
- **Response (210 Created)**: Returns the complete security report with vulnerabilities categorized under permissions, network/API, privacy, and code obfuscation, alongside review sentiment analytics. See [scanner.service.ts](file:///c:/Users/Nadhiya/Desktop/appsec-app/backend/src/services/scanner.service.ts) and [gemini.service.ts](file:///c:/Users/Nadhiya/Desktop/appsec-app/backend/src/services/gemini.service.ts) for full JSON definitions.

### 2. Retrieve Scan History
- **Route**: `GET /api/scans/history`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Array of historical scan objects containing overall score, platform, metadata, and full findings lists.

### 3. Delete Scan Report
- **Route**: `DELETE /api/scans/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "message": "Scan deleted successfully"
  }
  ```

---

## Dashboard Stats Endpoint

### 1. Fetch User Dashboard Statistics
- **Route**: `GET /api/dashboard/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "totalScans": 4,
    "highRiskScans": 1,
    "avgScore": 66,
    "history": [
      {
        "id": "db84a56a-129a-41e9-86f2-1abce992ef12",
        "name": "Zoom",
        "score": 38,
        "date": "7/11/2026"
      },
      ...
    ]
  }
  ```
