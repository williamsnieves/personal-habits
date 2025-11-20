// Calendar domain types and utilities

export interface CalendarDay {
    date: string; // ISO date string (YYYY-MM-DD)
    completionCount: number;
    habitIds: string[];
}

export interface MonthlyStats {
    totalHabits: number;
    totalCompletions: number;
    completionRate: number;
    bestDay: string | null;
    currentStreak: number;
    longestStreak: number;
}

export interface CalendarData {
    month: number;
    year: number;
    days: CalendarDay[];
    stats: MonthlyStats;
}

// Helper functions for calendar calculations
export function getMonthDays(year: number, month: number): Date[] {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }

    return days;
}

export function formatDateISO(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return formatDateISO(date1) === formatDateISO(date2);
}

export function getCompletionLevel(count: number): 'none' | 'low' | 'medium' | 'high' {
    if (count === 0) return 'none';
    if (count <= 2) return 'low';
    if (count <= 4) return 'medium';
    return 'high';
}

export function calculateStreak(completionDates: string[]): { current: number; longest: number } {
    if (completionDates.length === 0) return { current: 0, longest: 0 };

    const sortedDates = completionDates
        .map(d => new Date(d))
        .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's a completion today or yesterday
    const mostRecent = sortedDates[0];
    mostRecent.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) {
        currentStreak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
            const current = new Date(sortedDates[i]);
            const previous = new Date(sortedDates[i - 1]);
            current.setHours(0, 0, 0, 0);
            previous.setHours(0, 0, 0, 0);

            const diff = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

            if (diff === 1) {
                currentStreak++;
                tempStreak++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        const current = new Date(sortedDates[i]);
        const previous = new Date(sortedDates[i - 1]);
        current.setHours(0, 0, 0, 0);
        previous.setHours(0, 0, 0, 0);

        const diff = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return { current: currentStreak, longest: longestStreak };
}
