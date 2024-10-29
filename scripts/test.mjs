import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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" });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user", 
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama3-8b-8192",
  });
}

// Gọi hàm main để chạy chương trình
main().catch(console.error);
