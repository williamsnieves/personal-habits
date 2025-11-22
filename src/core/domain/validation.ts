import { z } from 'zod';

// Validation schemas for Habit operations
export const CreateHabitSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    frequency: z.enum(['daily', 'weekly']),
});

export const UpdateHabitSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    frequency: z.enum(['daily', 'weekly']).optional(),
});

export const LogHabitSchema = z.object({
    date: z.string().transform((val) => new Date(val)),
    status: z.enum(['completed', 'skipped']),
});

export type CreateHabitInput = z.infer<typeof CreateHabitSchema>;
export type UpdateHabitInput = z.infer<typeof UpdateHabitSchema>;
export type LogHabitInput = z.infer<typeof LogHabitSchema>;
