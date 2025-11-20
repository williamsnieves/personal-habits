import { PrismaClient } from '@prisma/client';
import {
    Habit,
    HabitLog,
    HabitRepository,
    CreateHabitDTO,
    UpdateHabitDTO,
    LogHabitDTO,
} from '@/core/domain/habit';

export class PrismaHabitRepository implements HabitRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: CreateHabitDTO): Promise<Habit> {
        return await this.prisma.habit.create({
            data: {
                name: data.name,
                description: data.description,
                frequency: data.frequency,
            },
        }) as Habit;
    }

    async findAll(): Promise<Habit[]> {
        return await this.prisma.habit.findMany({
            include: {
                logs: {
                    orderBy: { date: 'desc' },
                    take: 7,
                },
            },
        }) as Habit[];
    }

    async findById(id: string): Promise<Habit | null> {
        return await this.prisma.habit.findUnique({
            where: { id },
            include: {
                logs: {
                    orderBy: { date: 'desc' },
                    take: 7,
                },
            },
        }) as Habit | null;
    }

    async update(id: string, data: UpdateHabitDTO): Promise<Habit> {
        return await this.prisma.habit.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                frequency: data.frequency,
            },
        }) as Habit;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.habit.delete({
            where: { id },
        });
    }

    async logCompletion(habitId: string, data: LogHabitDTO): Promise<HabitLog> {
        return await this.prisma.habitLog.upsert({
            where: {
                habitId_date: {
                    habitId,
                    date: data.date,
                },
            },
            update: {
                status: data.status,
            },
            create: {
                habitId,
                date: data.date,
                status: data.status,
            },
        }) as HabitLog;
    }
}
