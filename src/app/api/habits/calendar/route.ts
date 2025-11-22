import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CalendarData, CalendarDay, MonthlyStats, formatDateISO, calculateStreak } from '@/core/domain/calendar';

// GET /api/habits/calendar - Fetch calendar data for a specific month
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const monthParam = searchParams.get('month');
        const yearParam = searchParams.get('year');

        const now = new Date();
        const month = monthParam ? parseInt(monthParam) : now.getMonth();
        const year = yearParam ? parseInt(yearParam) : now.getFullYear();

        // Validate month and year
        if (month < 0 || month > 11 || year < 2000 || year > 2100) {
            return NextResponse.json(
                { error: 'Invalid month or year' },
                { status: 400 }
            );
        }

        // Get first and last day of the month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0, 23, 59, 59);

        // Fetch all habit logs for the month
        const habitLogs = await prisma.habitLog.findMany({
            where: {
                date: {
                    gte: firstDay,
                    lte: lastDay,
                },
                status: 'completed',
            },
            include: {
                habit: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        // Group logs by date
        const logsByDate = new Map<string, CalendarDay>();

        habitLogs.forEach(log => {
            const dateKey = formatDateISO(log.date);

            if (!logsByDate.has(dateKey)) {
                logsByDate.set(dateKey, {
                    date: dateKey,
                    completionCount: 0,
                    habitIds: [],
                });
            }

            const dayData = logsByDate.get(dateKey)!;
            dayData.completionCount++;
            dayData.habitIds.push(log.habitId);
        });

        // Convert to array
        const days = Array.from(logsByDate.values());

        // Calculate statistics
        const totalCompletions = habitLogs.length;
        const uniqueHabits = new Set(habitLogs.map(log => log.habitId));
        const totalHabits = uniqueHabits.size;

        // Find best day (most completions)
        let bestDay: string | null = null;
        let maxCompletions = 0;

        days.forEach(day => {
            if (day.completionCount > maxCompletions) {
                maxCompletions = day.completionCount;
                bestDay = day.date;
            }
        });

        // Calculate completion rate (days with at least one completion / total days in month)
        const daysInMonth = lastDay.getDate();
        const daysWithCompletions = days.length;
        const completionRate = daysInMonth > 0 ? (daysWithCompletions / daysInMonth) * 100 : 0;

        // Calculate streaks (fetch all logs for streak calculation)
        const allLogs = await prisma.habitLog.findMany({
            where: {
                status: 'completed',
            },
            select: {
                date: true,
            },
            orderBy: {
                date: 'desc',
            },
        });

        const uniqueDates = Array.from(new Set(allLogs.map(log => formatDateISO(log.date))));
        const streaks = calculateStreak(uniqueDates);

        const stats: MonthlyStats = {
            totalHabits,
            totalCompletions,
            completionRate: Math.round(completionRate),
            bestDay,
            currentStreak: streaks.current,
            longestStreak: streaks.longest,
        };

        const calendarData: CalendarData = {
            month,
            year,
            days,
            stats,
        };

        return NextResponse.json(calendarData, { status: 200 });
    } catch (error) {
        console.error('Error fetching calendar data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch calendar data' },
            { status: 500 }
        );
    }
}
