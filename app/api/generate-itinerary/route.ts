import { streamObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
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

    // Fetch some context from DB to make the itinerary grounded
    await dbConnect();
    // We can do a basic text search to find relevant destinations to inject as context
    const contextDestinations = await Destination.find({
      $or: [
        { title: { $regex: prompt, $options: 'i' } },
        { region: { $regex: prompt, $options: 'i' } },
        { category: { $regex: prompt, $options: 'i' } },
        { vibe: { $regex: prompt, $options: 'i' } }
      ]
    }).limit(3);

    const contextData = contextDestinations.map(d => ({
      title: d.title,
      description: d.description,
      bestTimeToVisit: d.bestTimeToVisit,
      thingsToDo: d.thingsToDo,
      stays: d.stays,
      food: d.food
    }));

    const systemPrompt = `You are an expert, highly knowledgeable travel planner for Offbeat India.
Your task is to generate a highly specific, realistic, and detailed day-by-day itinerary based on the user's request.

CRITICAL INSTRUCTIONS:
1. NO GENERIC PLACEHOLDERS: Do not use generic phrases like "Arrive and settle in", "Enjoy local cuisine", or "Relax and interact with locals".
2. SPECIFIC NAMES & PLACES: Name specific places, trails, restaurants, viewpoints, or historical sites (e.g., "Trek to Tungnath Temple and Chandrashila Peak" instead of "Local Trekking").
3. UNIQUE DAYS: Every single day must be completely unique with distinct activities, times, and detailed descriptions. Do not repeat activities or patterns.
4. BE DESCRIPTIVE: For each activity, write a compelling description (2-3 sentences) explaining exactly what the traveler will see or do, why it's special, and practical tips.

Use the following context from our database if relevant to ground your recommendations:
${JSON.stringify(contextData)}

If the context is empty or irrelevant, use your vast knowledge of Indian geography, local culture, hidden gems, and travel logistics to create an incredibly authentic and specific itinerary.`;

    const result = streamObject({
      model: groq('llama-3.3-70b-versatile'),
      temperature: 0.7,
      system: systemPrompt,
      prompt: prompt,
      schema: z.object({
        tripTitle: z.string().describe("A catchy title for the trip"),
        tripSummary: z.string().describe("A short, exciting paragraph summarizing the vibe and goals of the trip"),
        days: z.array(z.object({
          dayNumber: z.number(),
          theme: z.string().describe("A short theme for the day, e.g. 'Arrival & Acclimatization' or 'Temple Run'"),
          activities: z.array(z.object({
            time: z.string().describe("E.g. 'Morning (9:00 AM - 1:00 PM)' or 'Evening'"),
            title: z.string().describe("Specific title, e.g., 'Trek to Tungnath Temple' (NOT 'Local Trekking')"),
            description: z.string().describe("Detailed 2-3 sentence description of exactly what to do, what to see, and why it's special."),
            type: z.enum(["Activity", "Food", "Travel", "Stay", "Relaxation"])
          }))
        })),
        recommendedStays: z.array(z.object({
          name: z.string().describe("Specific hotel, hostel, or homestay name"),
          description: z.string().describe("Why this stay is recommended and its vibe"),
          priceRange: z.string().describe("e.g. 'Budget', 'Mid-range', 'Luxury'")
        })).optional(),
        localFoodSpecialties: z.array(z.string()).describe("A list of specific local dishes they MUST try").optional()
      }),
    });

    return result.toTextStreamResponse();
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
