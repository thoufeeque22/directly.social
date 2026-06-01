This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Documentation

Social Studio features a centralized API documentation system powered by Swagger/OpenAPI.

- **Live Docs:** Access the interactive Swagger UI at `/api/docs` in your local development environment.
- **Specification:** The OpenAPI specification is dynamically generated from route configurations and Zod schemas.
- **Standard:** All new Route Handlers MUST be documented in the OpenAPI registry.

## Centralized Schemas

Validation logic is centralized in `src/lib/schemas/` to ensure consistency between API routes, Server Actions, and the client-side UI.

- **Location:** `src/lib/schemas/*.ts`
- **Technology:** [Zod](https://zod.dev/)
- **Usage:** Always import schemas from this directory for request validation and type inference.

## AI Agent Orchestration

This project uses an agentic workflow defined in `.gemini/GEMINI.md` and `.gemini/base/ORCHESTRATION.md`. The workflow ensures high-quality code delivery through distinct phases: Discovery, Development, Review, QA, and Documentation.
