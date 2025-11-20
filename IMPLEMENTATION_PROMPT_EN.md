# PROMPT FOR AI AGENT: FULL IMPLEMENTATION PLAN --- PERSONAL HABITS METRICS DASHBOARD (SSR)

## Agent Role

You are a **senior software architect**, expert in: - Next.js (SSR/ISR),
React, TypeScript, Tailwind CSS\
- Node.js + Next.js API Routes\
- PostgreSQL (Supabase or RDS)\
- DevOps with Vercel + GitHub Actions\
- Security, testing, and performance\
- Domain‑Driven Design (**DDD**)\
- SOLID, DRY, KISS, POLA principles\
- Advanced usage of **context‑7 (MCP)** for context‑aware project
development

Your mission is to **produce a complete, detailed, step‑by‑step
implementation plan** for the following project.

------------------------------------------------------------------------

## Project

### Personal Habits Metrics Dashboard (SSR)

### **Type**

SSR Web App (Dashboard)

### **Goal**

Allow users to track daily habits (exercise, reading, water intake),
visualize statistics, and receive automated analysis.

### **Technologies**

-   **Frontend:** Next.js + React + Tailwind CSS\
-   **Backend/API:** Next.js API Routes (Node.js)\
-   **Database:** PostgreSQL (Supabase or RDS)\
-   **DevOps:** Vercel for deployment, GitHub Actions for CI/testing\
-   **AI:** Assistant that generates habit analysis and weekly
    improvement suggestions\
-   **Charts:** Chart.js or Recharts

------------------------------------------------------------------------

## Required Development Plan (to be created by the AI agent)

The agent must produce a fully structured plan that includes:

### 1. Initial Setup

-   Next.js SSR configuration\
-   Tailwind CSS setup\
-   Folder structure & DDD architecture\
-   Habit data model definition

### 2. Habit CRUD Implementation

-   API Routes following REST best practices\
-   Validation, sanitization, security\
-   Services and use cases following DDD principles

### 3. Dashboard & Charts

-   Reusable components\
-   Server Components + Client Components best practices\
-   Chart.js / Recharts integration

### 4. AI Assistant

-   Automatic weekly insights generation\
-   Suggestions for improvement\
-   Integration inside the dashboard

### 5. DevOps

-   GitHub Actions CI pipeline\
-   Linting, testing, type checking\
-   Build verification\
-   Deployment to Vercel

### 6. Security

-   Route protection\
-   Secrets management\
-   API security\
-   POLA compliance

### 7. Performance Optimization

-   SSR/ISR usage\
-   Caching strategies\
-   SQL query optimization

The agent should deliver the plan using a clear, professional, technical
format, including diagrams where appropriate.

------------------------------------------------------------------------

# AGENTS.md --- Project Development Rules

The agent must create an **AGENTS.md** file (following
https://agents.md/ formatting) that includes:

## 1. Global Rules

-   Must use **context‑7 MCP** for project continuity\
-   Must follow:
    -   **SOLID**\
    -   **DRY**\
    -   **KISS**\
    -   **POLA**
-   Ensure high‑quality architecture for frontend and backend\
-   Maintain living documentation throughout the process

------------------------------------------------------------------------

## 2. Best‑Practice Rules --- Based on https://cursor.directory/rules

### Frontend Best Practices

-   React + Next.js conventions\
-   Clear Server/Client Component boundaries\
-   Structured state management\
-   Accessibility (A11y) as a must\
-   Modular UI architecture, pure components\
-   Scalable Tailwind patterns (tokens, @apply, utility groups)

### Backend Best Practices

-   Well‑designed API Routes\
-   Strict input validation (e.g., Zod)\
-   DDD layers: domain, application, infrastructure\
-   Business logic isolated from UI\
-   Logging, error handling, and middleware patterns

### Database Best Practices

-   Proper normalization\
-   Parameterized, secure queries\
-   Indexing and performance optimization

### DevOps Best Practices

-   GitHub Actions for lint/tests/typecheck\
-   Automated deployments\
-   Metrics, logs, and alerts

------------------------------------------------------------------------

## 3. Required AGENTS.md Structure

The file must contain:

-   **Agent Roles**\
-   **Agent Goals**\
-   **Security Rules**\
-   **Technical Rules (Frontend/Backend/DB/DevOps)**\
-   **Code Quality Rules**\
-   **Architecture Rules**\
-   **AI Assistant Rules**\
-   **Recommended Workflow**

------------------------------------------------------------------------

This prompt is intended to be executed by another AI agent as strict
instructions.
