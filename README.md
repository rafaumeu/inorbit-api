<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=FFCA28&height=180&section=header&text=InOrbit%20API&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Goal%20Tracking%20REST%20API&descSize=18&descAlignY=52"/>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify" alt="Fastify"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge" alt="Drizzle ORM"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker" alt="Docker"/>
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger" alt="Swagger"/>
</p>

## Overview

A high-performance REST API for weekly goal tracking built with **Fastify** and **Drizzle ORM**. Create goals, track completions, and get weekly summaries with an optimized PostgreSQL backend.

## Features

- Create weekly goals with desired frequency
- Mark daily goal completions
- Get pending goals for the current week
- Weekly completion summary with visual progress
- Swagger/OpenAPI documentation
- Dockerized development environment

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Fastify** | 5.x | High-performance HTTP framework |
| **Drizzle ORM** | 0.38.x | Type-safe SQL query builder |
| **PostgreSQL** | 16.x | Relational database |
| **Zod** | 3.x | Schema validation with type inference |
| **TypeScript** | 5.x | End-to-end type safety |
| **Docker** | — | Containerized development |

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/goals` | Create a new weekly goal |
| `POST` | `/completions` | Mark a goal as completed |
| `GET` | `/pending-goals` | Get pending goals for current week |
| `GET` | `/summary` | Get weekly completion summary |

## API Documentation

Interactive Swagger UI available at `/docs` when running the server.

### Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/goals` | Create a new weekly goal |
| `POST` | `/completions` | Mark a goal as completed |
| `GET` | `/pending-goals` | Get pending goals for current week |
| `GET` | `/summary` | Get weekly completion summary |
| `GET` | `/stats` | Get goal statistics |

### Generate Typed Client

```bash
npx orval  # generates typed API client from OpenAPI spec
```

## Getting Started

```bash
# Clone
git clone https://github.com/rafaumeu/inorbit-api.git
cd inorbit-api

# Install
npm install

# Set up environment
cp .env.example .env

# Run with Docker (PostgreSQL)
docker compose up -d

# Start dev server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://docker:docker@localhost:5432/inorbit
```

## Database Schema

```
goals
├── id (UUID, PK)
├── title (VARCHAR)
├── desiredWeeklyFrequency (INTEGER)
└── createdAt (TIMESTAMP)

goalCompletions
├── id (UUID, PK)
├── goalId (UUID, FK → goals)
└── createdAt (TIMESTAMP)
```

## Project Structure

```
src/
├── db/
│   ├── connection.ts
│   ├── schema/
│   └── migrations/
├── http/
│   ├── routes/
│   └── server.ts
└── env.ts
```

## License

MIT

<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=FFCA28&height=100&section=footer"/>
  <br/>
  <sub>Built with ❤️ by <a href="https://github.com/rafaumeu">Rafael Zendron</a></sub>
</div>

<p align="center">
  <a href="https://github.com/rafaumeu/inorbit-api/generate"><img src="https://img.shields.io/badge/Use_This_Template-FFCA28?style=for-the-badge&logo=github&logoColor=white" alt="Use this template"/></a>
</p>

