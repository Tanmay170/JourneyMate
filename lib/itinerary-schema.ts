import { z } from "zod"

export const itinerarySchema = z.object({
  tripTitle: z.string().describe("A catchy title for the trip"),
  tripSummary: z.string().describe("A short, exciting paragraph summarizing the vibe and goals of the trip"),
  days: z.array(
    z.object({
      dayNumber: z.number(),
      theme: z.string().describe("A short theme for the day, e.g. 'Arrival & Acclimatization' or 'Temple Run'"),
      activities: z.array(
        z.object({
          time: z.string().describe("E.g. 'Morning (9:00 AM - 1:00 PM)' or 'Evening'"),
          title: z.string().describe("Specific title, e.g., 'Trek to Tungnath Temple' (NOT 'Local Trekking')"),
          description: z
            .string()
            .describe("Detailed 2-3 sentence description of exactly what to do, what to see, and why it's special."),
          type: z.enum(["Activity", "Food", "Travel", "Stay", "Relaxation"]),
        }),
      ),
    }),
  ),
  recommendedStays: z
    .array(
      z.object({
        name: z.string().describe("Specific hotel, hostel, or homestay name"),
        description: z.string().describe("Why this stay is recommended and its vibe"),
        priceRange: z.string().describe("e.g. 'Budget', 'Mid-range', 'Luxury'"),
      }),
    )
    .optional(),
  localFoodSpecialties: z.array(z.string()).describe("A list of specific local dishes they MUST try").optional(),
})

export type Itinerary = z.infer<typeof itinerarySchema>
