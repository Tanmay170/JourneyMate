import { streamText, tool, isStepCount } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY is not configured in .env.local" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const groq = createGroq({
    apiKey: groqApiKey,
  });

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages,
    system: `You are the ultimate Offbeat India Travel Assistant. Your job is to help users plan amazing itineraries, find the perfect stays, and discover local food across India's offbeat destinations.
    
    You have access to a tool called 'searchDestinations' and 'getDestinationDetails'. 
    ALWAYS use these tools to fetch real data from our database before recommending anything.
    When generating an itinerary, make sure it is explanatory, day-wise, and explicitly lists real stay options and food options from the database. Format your response beautifully in Markdown, using bold text, bullet points, and headers.
    Be enthusiastic, adventurous, and incredibly helpful!`,
    tools: {
      searchDestinations: tool({
        description: 'Search for destinations by name, region, or vibe (e.g. "Mountains", "South India", "Chill"). Returns a list of matching destinations with their slugs.',
        parameters: z.object({
          query: z.string().describe('The search query (e.g. "Spiti", "beach", "adventure")'),
        }),
        execute: async ({ query }: { query: string }) => {
          await dbConnect();
          const q = query.toLowerCase();
          const dests = await Destination.find({}).select('title slug region category vibe');
          const matched = dests.filter(d =>
            d.title.toLowerCase().includes(q) ||
            d.region.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q) ||
            (d.vibe && d.vibe.some((v: string) => v.toLowerCase().includes(q)))
          );
          return matched.map(d => ({ title: d.title, slug: d.slug, region: d.region }));
        },
      }),
      getDestinationDetails: tool({
        description: 'Get full details for a specific destination by its slug to build an itinerary. Includes stays, food, thingsToDo, and bestTimeToVisit.',
        parameters: z.object({
          slug: z.string().describe('The slug of the destination (e.g. "spiti-valley")'),
        }),
        execute: async ({ slug }: { slug: string }): Promise<any> => {
          await dbConnect();
          const dest = await Destination.findOne({ slug });
          if (!dest) return { error: "Destination not found" };
          return {
            title: dest.title,
            description: dest.description,
            bestTimeToVisit: dest.bestTimeToVisit,
            thingsToDo: dest.thingsToDo,
            stays: dest.stays.map((s: any) => ({ name: s.name, type: s.type, priceRange: s.priceRange, features: s.features })),
            food: dest.food.map((f: any) => ({ name: f.name, type: f.type, specialties: f.specialties })),
            transport: dest.transport
          };
        },
      }),
    },
    stopWhen: isStepCount(3),
  });

  return result.toTextStreamResponse();
}
