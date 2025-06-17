import { DocumentChunk } from '@/hooks/useRAG';

export const adminDocuments: DocumentChunk[] = [
  {
    id: 'admin-welcome-0',
    content: `Welcome to the vocal knowledge scribe. This knowledge base is curated by the administrator.`,
    metadata: { fileName: 'admin-welcome.txt', chunkIndex: 0 }
  },
  {
    id: 'admin-info-1',
    content: `You can ask questions about the provided documents, but uploading new documents has been disabled for regular users.`,
    metadata: { fileName: 'admin-info.txt', chunkIndex: 0 }
  }
];
