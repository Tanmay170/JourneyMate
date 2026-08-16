import { streamObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function main() {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.error("No API key");
    return;
  }

  const groq = createGroq({ apiKey: groqApiKey });

  try {
    const result = streamObject({
      model: (groq as any)('llama-3.3-70b-versatile', { structuredOutputs: false }),
      prompt: "Goa",
      schema: z.object({
        tripTitle: z.string(),
      })
    });

    for await (const chunk of result.partialObjectStream) {
      console.log(chunk);
    }
  } catch (err: any) {
    console.error("ERROR", err.message);
    console.error(err.stack);
  }
}

main();
