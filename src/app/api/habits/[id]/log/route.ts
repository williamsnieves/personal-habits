import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { PrismaHabitRepository } from '@/infrastructure/repositories/prisma-habit.repository';
import { LogHabitUseCase } from '@/application/use-cases/log-habit.use-case';

// Initialize repository and use case
const habitRepository = new PrismaHabitRepository(prisma);
const logHabitUseCase = new LogHabitUseCase(habitRepository);

// POST /api/habits/[id]/log - Log habit completion
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: habitId } = await params;
        const body = await request.json();

        const logSchema = z.object({
            date: z.string().transform((val) => new Date(val)),
            status: z.enum(['completed', 'skipped']),
        });

        const validation = logSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        const log = await logHabitUseCase.execute(habitId, validation.data);
        return NextResponse.json(log, { status: 201 });
    } catch (error) {
        console.error('Error logging habit:', error);
        return NextResponse.json(
            { error: 'Failed to log habit' },
            { status: 500 }
        );
    }
}
