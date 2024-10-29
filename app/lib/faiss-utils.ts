import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import fs from 'fs';
import path from 'path';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: GOOGLE_API_KEY,
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});

let vectorStore: FaissStore | null = null;

export async function initFaiss() {
  if (!vectorStore) {
    const vectorStorePath = path.join(process.cwd(), 'data', 'faiss-store');
    const docstorePath = path.join(vectorStorePath, 'docstore.json');
    const indexPath = path.join(vectorStorePath, 'faiss.index');

    // Check if vector store exists
    if (fs.existsSync(docstorePath) && fs.existsSync(indexPath)) {
      // Load existing vector store
      vectorStore = await FaissStore.load(vectorStorePath, embeddings);
      console.log('Loaded existing vector store');
    } else {
      // Create new vector store from documents
      console.log('Creating new vector store...');
      const dataDir = path.join(process.cwd(), 'data');
      const files = fs.readdirSync(dataDir);
      
      const documents = files.map(file => ({
        pageContent: fs.readFileSync(path.join(dataDir, file), 'utf-8'),
        metadata: { fileName: file }
      }));

      vectorStore = await FaissStore.fromDocuments(documents, embeddings);
      await vectorStore.save(vectorStorePath);
      console.log('Created and saved new vector store');
    }
  }
}

export async function searchFaiss(query: string, k: number = 3): Promise<{
  context: string;
  isRagWorking: boolean;
  ragSources: Array<{
    id: string;
    fileName: string;
    snippet: string;
    score: number;
  }>;
}> {
  try {
    await initFaiss();
    
    if (!vectorStore) {
      throw new Error('Vector store not initialized');
    }

    const results = await vectorStore.similaritySearchWithScore(query, k);

    const formattedResults = results.map(([doc, score], idx) => ({
      id: `doc-${idx}`,
      fileName: doc.metadata.fileName || `Document ${idx + 1}`,
      snippet: doc.pageContent,
      score: 1 - score // Convert distance to similarity score
    }));

    return {
      context: formattedResults.map(r => r.snippet).join('\n\n'),
      isRagWorking: true,
      ragSources: formattedResults
    };

  } catch (error) {
    console.error('FAISS Search Error:', error);
    return {
      context: '',
      isRagWorking: false,
      ragSources: []
    };
  }
}