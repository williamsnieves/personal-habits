import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { PrismaHabitRepository } from '@/infrastructure/repositories/prisma-habit.repository';
import { UpdateHabitUseCase } from '@/application/use-cases/update-habit.use-case';
import { DeleteHabitUseCase } from '@/application/use-cases/delete-habit.use-case';

// Initialize repository and use cases
const habitRepository = new PrismaHabitRepository(prisma);
const updateHabitUseCase = new UpdateHabitUseCase(habitRepository);
const deleteHabitUseCase = new DeleteHabitUseCase(habitRepository);

// PUT /api/habits/[id] - Update a habit
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const habitSchema = z.object({
            name: z.string().min(1).optional(),
            description: z.string().optional(),
            frequency: z.enum(['daily', 'weekly']).optional(),
        });

        const validation = habitSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        const habit = await updateHabitUseCase.execute(id, validation.data);
        return NextResponse.json(habit, { status: 200 });
    } catch (error) {
        console.error('Error updating habit:', error);
        return NextResponse.json(
            { error: 'Failed to update habit' },
            { status: 500 }
        );
    }
}

// DELETE /api/habits/[id] - Delete a habit
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteHabitUseCase.execute(id);
        return NextResponse.json({ message: 'Habit deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting habit:', error);
        return NextResponse.json(
            { error: 'Failed to delete habit' },
            { status: 500 }
        );
    }
}
