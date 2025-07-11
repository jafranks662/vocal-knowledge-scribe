
import { useState, useCallback, useEffect } from 'react';
import { OpenAI } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { adminDocuments } from '@/data/adminDocuments';

export interface LangChainDocument {
  id: string;
  content: string;
  metadata: {
    fileName: string;
    chunkIndex: number;
  };
}

export const useLangChainRAG = () => {
  const [documents] = useState<LangChainDocument[]>(adminDocuments);
  const [vectorStore, setVectorStore] = useState<MemoryVectorStore | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');

  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

  // Initialize vector store and embeddings
  const initializeRAG = useCallback(async () => {
    const openAIKey = envApiKey;
    if (!openAIKey || !openAIKey.trim()) {
      console.warn('OpenAI API key not configured');
      return;
    }

    try {
      setApiKey(openAIKey);
      
      // Create embeddings instance
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: openAIKey,
        modelName: 'text-embedding-3-small'
      });

      // Convert documents to LangChain Document format
      const langChainDocs = documents.map(doc => 
        new Document({
          pageContent: doc.content,
          metadata: doc.metadata
        })
      );

      // Create vector store from documents
      const store = await MemoryVectorStore.fromDocuments(
        langChainDocs,
        embeddings
      );

      setVectorStore(store);
      setIsInitialized(true);
      console.log('LangChain RAG initialized successfully');
    } catch (error) {
      console.error('Failed to initialize LangChain RAG:', error);
      throw new Error('Failed to initialize RAG system');
    }
  }, [documents, envApiKey]);

  // Automatically initialize when the hook loads and a key is present
  useEffect(() => {
    if (!isInitialized) {
      initializeRAG();
    }
  }, [initializeRAG, isInitialized]);

  const generateResponse = useCallback(async (query: string): Promise<string> => {
    if (!isInitialized || !vectorStore || !apiKey) {
      return "Please initialize the RAG system with your OpenAI API key first.";
    }

    try {
      // Create LLM instance
      const llm = new OpenAI({
        openAIApiKey: apiKey,
        modelName: 'gpt-4o-mini',
        temperature: 0.7
      });

      // Create custom prompt template
      const promptTemplate = new PromptTemplate({
        template: `Use the following context to answer the question. If you cannot answer based on the context, say so clearly.

Context: {context}

Question: {question}

Answer:`,
        inputVariables: ['context', 'question']
      });

      // Create retrieval QA chain with correct retriever method
      const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever(), {
        prompt: promptTemplate,
        returnSourceDocuments: true
      });

      // Generate response
      const result = await chain.call({ query });

      // Format the response with source information
      const sourceFiles = result.sourceDocuments
        ?.map((doc: any) => doc.metadata.fileName)
        .filter((fileName: string, index: number, arr: string[]) => arr.indexOf(fileName) === index)
        .join(', ') || 'Unknown sources';

      return `${result.text}

Sources: ${sourceFiles}`;

    } catch (error) {
      console.error('Error generating LangChain response:', error);
      return "I apologize, but I encountered an error while processing your question. Please try again.";
    }
  }, [isInitialized, vectorStore, apiKey]);

  const searchRelevantChunks = useCallback(async (query: string, limit: number = 3): Promise<LangChainDocument[]> => {
    if (!isInitialized || !vectorStore) {
      return [];
    }

    try {
      const results = await vectorStore.similaritySearch(query, limit);
      
      return results.map((doc, index) => ({
        id: `langchain-${index}`,
        content: doc.pageContent,
        metadata: doc.metadata as { fileName: string; chunkIndex: number }
      }));
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }, [isInitialized, vectorStore]);

  return {
    documents,
    generateResponse,
    searchRelevantChunks,
    initializeRAG,
    isInitialized,
    documentCount: documents.length,
  };
};
