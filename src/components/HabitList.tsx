"use client";

import React from 'react';
import { Check, Clock, MapPin } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';

/**
 * HabitList Component
 * Displays today's habits with completion status
 * Uses useHabits hook for data management
 */
export function HabitList() {
    const { habits, loading, logHabit } = useHabits();

    const handleToggleHabit = async (habitId: string) => {
        try {
            await logHabit(habitId, new Date(), 'completed');
        } catch (error) {
            console.error("Failed to log habit", error);
        }
    };

    const isHabitCompletedToday = (logs: { date: Date | string; status: string }[] = []) => {
        const today = new Date().toDateString();
        return logs.some(log => {
            const logDate = new Date(log.date).toDateString();
            return logDate === today && log.status === 'completed';
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-soft">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">Today&apos;s Todos</h2>
                <button className="text-sm text-text-secondary hover:text-primary">
                    View Details
                </button>
            </div>

            <div className="space-y-4">
                {habits.map((habit) => {
                    const isCompleted = isHabitCompletedToday(habit.logs);

                    return (
                        <div
                            key={habit.id}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isCompleted
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    📝
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">{habit.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> 08:00am
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} /> Home
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggleHabit(habit.id)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isCompleted
                                    ? 'bg-green-500 text-white'
                                    : 'border-2 border-gray-200 text-transparent hover:border-primary'
                                    }`}
                            >
                                <Check size={16} strokeWidth={3} />
                            </button>
                        </div>
                    );
                })}

                {habits.length === 0 && (
                    <div className="text-center py-8 text-text-secondary">
                        No habits yet. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
