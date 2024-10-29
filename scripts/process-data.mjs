import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import fs from 'fs';
import path from 'path';

const GOOGLE_API_KEY = "AIzaSyDs5Z7vT6XrDGk8K1GAaIpt598uljNthFM";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: GOOGLE_API_KEY,
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});

async function processDataFile(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return false;
    }

    // Read and split content
    const content = fs.readFileSync(filePath, 'utf-8');
    const chunks = content.split(/\n\s*\n/).filter((chunk) => chunk.trim());

    console.log('Number of chunks:', chunks.length);

    if (chunks.length === 0) {
      console.error('No valid text chunks found in file');
      return false;
    }

    // Create documents array
    const documents = chunks.map(chunk => ({
      pageContent: chunk,
      metadata: {}
    }));

    const dataDir = 'E:\\chatbot\\customer-support-agent\\data';
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create and save FAISS store
    try {
      const vectorStore = await FaissStore.fromDocuments(
        documents,
        embeddings
      );

      // Save the vector store
      const directory = path.join(dataDir, 'faiss-store');
      await vectorStore.save(directory);
      
      console.log('Vector store saved to:', directory);
      return true;

    } catch (error) {
      console.error('Error creating vector store:', error);
      console.error('Error details:', error.message);
      return false;
    }

  } catch (error) {
    console.error('Error in processDataFile:', error);
    console.error('Error details:', error.message);
    return false;
  }
}

async function generateEmbeddings() {
  return true;
}

async function main() {
  try {
    const filePath = 'E:\\chatbot\\customer-support-agent\\data\\data.txt';
    const result = await processDataFile(filePath);

    if (result) {
      console.log('Successfully processed data file and created embeddings');
    } else {
      console.log('Failed to process data file');
    }

    await generateEmbeddings();
  } catch (error) {
    console.error('Error in main:', error);
    console.error('Error details:', error.message);
  }
}

main().catch(console.error);

export {
  processDataFile,
  generateEmbeddings
};