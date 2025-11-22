import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface Habit {
    id: string;
    name: string;
    description?: string;
    frequency: 'daily' | 'weekly';
    logs?: HabitLog[];
}

export interface HabitLog {
    id: string;
    habitId: string;
    date: Date;
    status: 'completed' | 'skipped';
}

/**
 * Custom hook for managing habits
 * Provides CRUD operations and optimistic UI updates
 */
export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHabits = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiClient.get<Habit[]>('/api/habits');
            setHabits(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch habits');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHabits();
    }, [fetchHabits]);

    const createHabit = useCallback(async (data: Omit<Habit, 'id' | 'logs'>) => {
        try {
            const newHabit = await apiClient.post<Habit>('/api/habits', data);
            setHabits((prev) => [...prev, newHabit]);
            return newHabit;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create habit');
            throw err;
        }
    }, []);

    const updateHabit = useCallback(async (id: string, data: Partial<Habit>) => {
        try {
            const updated = await apiClient.put<Habit>(`/api/habits/${id}`, data);
            setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update habit');
            throw err;
        }
    }, []);

    const deleteHabit = useCallback(async (id: string) => {
        try {
            await apiClient.delete(`/api/habits/${id}`);
            setHabits((prev) => prev.filter((h) => h.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete habit');
            throw err;
        }
    }, []);

    const logHabit = useCallback(
        async (habitId: string, date: Date, status: 'completed' | 'skipped') => {
            try {
                const log = await apiClient.post<HabitLog>(`/api/habits/${habitId}/log`, {
                    date: date.toISOString(),
                    status,
                });

                // Optimistic update
                setHabits((prev) =>
                    prev.map((habit) =>
                        habit.id === habitId
                            ? {
                                ...habit,
                                logs: [log, ...(habit.logs || [])].slice(0, 7),
                            }
                            : habit
                    )
                );

                return log;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to log habit');
                throw err;
            }
        },
        []
    );

    return {
        habits,
        loading,
        error,
        fetchHabits,
        createHabit,
        updateHabit,
        deleteHabit,
        logHabit,
    };
}
