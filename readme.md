This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
The purpose of it is to be able to experiment with RAG based on the uploaded CV files to retrieve candidate current profession and years of experience and provide summary.
CV file samples have been obtained from the dataset https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset.

## Getting Started

### Prerequisites

- [Node.js 18.17](https://nodejs.org/) or later.
- [Rancher Desktop](https://docs.rancherdesktop.io/getting-started/installation/) or [Colima](https://github.com/abiosoft/colima) or use Docker Desktop.

Run docker containers:

```bash
docker-compose up -d
```

Run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## LLM models

By default app uses Ollama model. This model can perform slow on local machine.

Better option is to use OpenAI gpt-3.5-turbo model. It provides much better performance and results.

If you want to use OpenAI model then create env.local file in the root of the project and specify:

```
LLM_MODEL=OpenAI
VECTOR_STORE=Chroma
OPENAI_API_KEY=<your api key>

```

Supported values for LLM_MODEL are: OpenAI, Ollama

> Ollama is default if not provided in the env variable

Supported values for VECTOR_STORE are: Chroma, PgVector

> Chroma is default if not provided in the env variable

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
