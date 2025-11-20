import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { PrismaHabitRepository } from '@/infrastructure/repositories/prisma-habit.repository';
import { CreateHabitUseCase } from '@/application/use-cases/create-habit.use-case';
import { ListHabitsUseCase } from '@/application/use-cases/list-habits.use-case';

// Initialize repository and use cases
const habitRepository = new PrismaHabitRepository(prisma);
const createHabitUseCase = new CreateHabitUseCase(habitRepository);
const listHabitsUseCase = new ListHabitsUseCase(habitRepository);

// GET /api/habits - Fetch all habits
export async function GET() {
    try {
        const habits = await listHabitsUseCase.execute();
        return NextResponse.json(habits, { status: 200 });
    } catch (error) {
        console.error('Error fetching habits:', error);
        return NextResponse.json(
            { error: 'Failed to fetch habits' },
            { status: 500 }
        );
    }
}

// POST /api/habits - Create a new habit
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const habitSchema = z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            frequency: z.enum(['daily', 'weekly']),
        });

        const validation = habitSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        const habit = await createHabitUseCase.execute(validation.data);
        return NextResponse.json(habit, { status: 201 });
    } catch (error) {
        console.error('Error creating habit:', error);
        return NextResponse.json(
            { error: 'Failed to create habit' },
            { status: 500 }
        );
    }
}
