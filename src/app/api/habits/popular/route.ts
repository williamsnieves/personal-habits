import { NextResponse } from 'next/server';

export interface PopularHabit {
    id: string;
    name: string;
    category: 'Health' | 'Productivity' | 'Mindfulness' | 'Learning' | 'Fitness';
    icon: string;
    likes: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

const POPULAR_HABITS: PopularHabit[] = [
    { id: 'ph-1', name: 'Drink 2L Water', category: 'Health', icon: '💧', likes: 12500, difficulty: 'Easy' },
    { id: 'ph-2', name: 'Morning Jog', category: 'Fitness', icon: '🏃', likes: 8400, difficulty: 'Medium' },
    { id: 'ph-3', name: 'Read 30 mins', category: 'Learning', icon: '📚', likes: 9200, difficulty: 'Medium' },
    { id: 'ph-4', name: 'Meditate 10m', category: 'Mindfulness', icon: '🧘', likes: 7800, difficulty: 'Easy' },
    { id: 'ph-5', name: 'No Sugar', category: 'Health', icon: '🚫', likes: 5600, difficulty: 'Hard' },
    { id: 'ph-6', name: 'Code 1 Hour', category: 'Productivity', icon: '💻', likes: 15000, difficulty: 'Medium' },
    { id: 'ph-7', name: 'Sleep 8 Hours', category: 'Health', icon: '😴', likes: 11000, difficulty: 'Medium' },
    { id: 'ph-8', name: 'Journaling', category: 'Mindfulness', icon: '✍️', likes: 4500, difficulty: 'Easy' },
    { id: 'ph-9', name: 'Learn New Word', category: 'Learning', icon: '🧠', likes: 3200, difficulty: 'Easy' },
    { id: 'ph-10', name: 'Plan Tomorrow', category: 'Productivity', icon: '📅', likes: 6700, difficulty: 'Easy' },
];

export async function GET() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(POPULAR_HABITS);
}
