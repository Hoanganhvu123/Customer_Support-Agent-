// import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// // Client-side utilities
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// export interface RAGSource {
//   id: string;
//   fileName: string;
//   snippet: string;
//   score: number;
// }

// // Client-side API call
// export async function retrieveContext(
//   query: string,
//   knowledgeBaseId: string,
//   n: number = 3
// ): Promise<{
//   context: string;
//   isRagWorking: boolean;
//   ragSources: RAGSource[];
// }> {
//   try {
//     const response = await fetch('/api/search', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ query, k: n }).
//     });
//     return await response.json();
//   } catch (error) {
//     console.error('Context retrieval error:', error);
//     return {
//       context: '',
//       isRagWorking: false,
//       ragSources: []
//     };
//   }
// }