import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PrismaHabitRepository } from '@/infrastructure/repositories/prisma-habit.repository';
import { LogHabitUseCase } from '@/application/use-cases/log-habit.use-case';
import { LogHabitSchema } from '@/core/domain/validation';
import { handleApiError } from '@/lib/api-error-handler';

// Initialize repository and use case
const habitRepository = new PrismaHabitRepository(prisma);
const logHabitUseCase = new LogHabitUseCase(habitRepository);

/**
 * POST /api/habits/[id]/log - Log habit completion
 * Records a completion or skip for a specific habit on a given date
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: habitId } = await params;
        const body = await request.json();

        // Validate request body
        const validatedData = LogHabitSchema.parse(body);

        // Execute use case
        const log = await logHabitUseCase.execute(habitId, validatedData);

        return NextResponse.json(log, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
