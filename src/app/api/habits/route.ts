import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PrismaHabitRepository } from '@/infrastructure/repositories/prisma-habit.repository';
import { CreateHabitUseCase } from '@/application/use-cases/create-habit.use-case';
import { ListHabitsUseCase } from '@/application/use-cases/list-habits.use-case';
import { CreateHabitSchema } from '@/core/domain/validation';
import { handleApiError } from '@/lib/api-error-handler';

// Initialize repository and use cases
const habitRepository = new PrismaHabitRepository(prisma);
const createHabitUseCase = new CreateHabitUseCase(habitRepository);
const listHabitsUseCase = new ListHabitsUseCase(habitRepository);

/**
 * GET /api/habits - Fetch all habits
 * Returns a list of all user habits with recent logs
 */
export async function GET() {
    try {
        const habits = await listHabitsUseCase.execute();
        return NextResponse.json(habits, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * POST /api/habits - Create a new habit
 * Validates input and creates a new habit record
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate request body
        const validatedData = CreateHabitSchema.parse(body);

        // Execute use case
        const habit = await createHabitUseCase.execute(validatedData);

        return NextResponse.json(habit, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
