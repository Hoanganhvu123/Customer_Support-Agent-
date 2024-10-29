// app/api/search/route.ts
import { searchFaiss } from '@/app/lib/faiss-utils';

export interface RAGSource {
  id: string;
  fileName: string;
  snippet: string;
  score: number;
}

export async function retrieveContext(query: string, knowledgeBaseId: string, n: number = 3): Promise<{
  context: string;
  isRagWorking: boolean;
  ragSources: RAGSource[];
}> {
  try {
    const results = await searchFaiss(query, n);
    return {
      context: results.context,
      isRagWorking: results.isRagWorking,
      ragSources: results.ragSources
    };
  } catch (error) {
    console.error('Search API Error:', error);
    return {
      context: '',
      isRagWorking: false,
      ragSources: [] as RAGSource[]
    };
  }
}