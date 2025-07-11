# Vocal Knowledge Scribe

A voice-enabled chatbot demonstrating Retrieval Augmented Generation (RAG). The assistant answers questions using a small set of administrator-provided documents. Voice messages are supported through the browser microphone API.

## Getting Started

1. Clone this repository and install dependencies.

```sh
git clone <YOUR_GIT_URL>
cd vocal-knowledge-scribe
npm install
npm run dev
```

This starts the Vite development server on <http://localhost:8080> with hot reloading.

## Adding Documents to the Database

Documents are stored in Supabase and mirrored locally for convenience. To include additional documents:

1. Add your content to Supabase using the dashboard or API.
2. Update `src/data/adminDocuments.ts` with new `DocumentChunk` entries so the demo recognizes them.
3. Restart the development server to load the new data.

Each `DocumentChunk` has an `id`, `content` string, and `metadata` describing the source file and chunk index.

## Tools Used

- **Vite** – build and development server
- **TypeScript** – static typing
- **React** – UI framework
- **shadcn-ui** – component library
- **Tailwind CSS** – styling
- **Supabase** – database backend
- **React Query** – remote data management
- **pdf-parse** – PDF text extraction
- **lucide-react** – icon set
- **zod** – schema validation

## Deployment

Run `npm run build` to create a production build in the `dist` folder and serve those files with any static host.
