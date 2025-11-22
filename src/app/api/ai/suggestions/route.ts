import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { Habit, HabitLog } from '@prisma/client';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

export async function POST() {
    try {
        // 1. Check for API Key
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OPENAI_API_KEY is missing. Returning mock data.');
            return NextResponse.json(MOCK_SUGGESTIONS);
        }

        // 2. Fetch User Context (Habits & Recent Logs)
        // In a real app with auth, we would filter by userId
        const habits = await prisma.habit.findMany({
            include: {
                logs: {
                    where: {
                        date: {
                            gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
                        },
                    },
                    orderBy: { date: 'desc' },
                },
            },
        });

        // 3. Format Context for AI
        const habitsContext = habits.map((h: Habit & { logs: HabitLog[] }) => ({
            name: h.name,
            frequency: h.frequency,
            completionsLast7Days: h.logs.length,
            description: h.description,
        }));

        const systemPrompt = `
      You are an expert Habit Coach AI. Your goal is to analyze the user's habit data and provide 2 personalized cards:
      1. "Insight": An observation about their current performance (e.g., consistency, streaks, patterns).
      2. "Suggestion": A specific new habit recommendation based on their current habits (e.g., if they run, suggest stretching).

      User Context:
      ${JSON.stringify(habitsContext, null, 2)}

      Output Rules:
      - Return strictly a JSON array of 2 objects.
      - Schema:
        [
          {
            "id": "ai-insight",
            "type": "insight",
            "title": "Short catchy title (max 5 words)",
            "description": "One sentence analysis (max 15 words).",
            "icon": "Single Emoji"
          },
          {
            "id": "ai-suggestion",
            "type": "suggestion",
            "title": "Habit Name",
            "description": "Why this fits (max 10 words).",
            "icon": "Single Emoji",
            "action": "Habit Name"
          }
        ]
      - Tone: Encouraging, concise, and professional.
      - If the user has no habits, suggest "Drink Water" and "Morning Walk".
    `;

        // 4. Call OpenAI API
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }],
            model: 'gpt-4o-mini', // or gpt-3.5-turbo
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        // Parse the response (handling potential wrapper object if model adds one)
        let parsedData = JSON.parse(content);

        // Ensure it's an array (sometimes models wrap in { "suggestions": [...] })
        if (!Array.isArray(parsedData)) {
            parsedData = parsedData.suggestions || parsedData.insights || Object.values(parsedData)[0] || MOCK_SUGGESTIONS;
        }

        return NextResponse.json(parsedData);

    } catch (error) {
        console.error('Error in AI suggestions:', error);
        // Fallback to mock data on error
        return NextResponse.json(MOCK_SUGGESTIONS);
    }
}

const MOCK_SUGGESTIONS = [
    {
        id: 'ai-1',
        type: 'insight',
        title: 'Morning Streak!',
        description: 'You are most consistent with habits before 10 AM. Keep it up!',
        icon: '🌅',
    },
    {
        id: 'ai-2',
        type: 'suggestion',
        title: 'Try Meditation',
        description: 'Based on your productivity habits, 5 mins of mindfulness could boost your focus.',
        icon: '🧘',
        action: 'Add Meditation',
    },
];
