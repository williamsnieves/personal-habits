# AGENTS.md - Project Rules

## 1. Global Rules
- **Context-Awareness**: Use context-7 MCP for continuity.
- **Principles**: Follow SOLID, DRY, KISS, POLA.
- **Architecture**: Maintain clean separation of concerns (DDD).
- **Documentation**: Keep `task.md` and `implementation_plan.md` updated.

## 2. Best Practices

### Frontend (Next.js + React + Tailwind)
- **Components**: Use functional components with TypeScript.
- **Styling**: Use Tailwind CSS utility classes. Avoid inline styles.
- **State**: Use React Context or Hooks for state management.
- **Performance**: Optimize images and use Server Components where possible.

### Backend (Next.js API Routes)
- **Validation**: Use Zod for input validation.
- **Security**: Validate all inputs and protect routes.
- **Error Handling**: Return consistent error responses.

### Database
- **Schema**: Use normalized schema.
- **Queries**: Use parameterized queries (via ORM/Query Builder).

## 3. Workflow
1. **Plan**: Update `task.md` and `implementation_plan.md`.
2. **Implement**: Write code following rules.
3. **Verify**: Run tests and linting.
4. **Review**: Request user review for critical changes.
