"use client";

import React, { useEffect, useState } from 'react';
import { Check, Clock, MapPin } from 'lucide-react';

type Habit = {
    id: string;
    name: string;
    description?: string;
    frequency: string;
    logs: { date: string; status: string }[];
};

export function HabitList() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const res = await fetch('/api/habits');
            const data = await res.json();
            setHabits(data);
        } catch (error) {
            console.error("Failed to fetch habits", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleHabit = async (id: string) => {
        // Optimistic update
        const today = new Date().toISOString();

        try {
            await fetch(`/api/habits/${id}/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: today,
                    status: 'completed'
                })
            });
            fetchHabits(); // Refresh to get latest state
        } catch (error) {
            console.error("Failed to log habit", error);
        }
    };

    if (loading) return <div className="p-4">Loading habits...</div>;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">Today&apos;s Todos</h2>
                <button className="text-sm text-text-secondary hover:text-primary">View Details</button>
            </div>

            <div className="space-y-4">
                {habits.map((habit) => {
                    const isCompleted = habit.logs.some(log => {
                        const logDate = new Date(log.date).toDateString();
                        const today = new Date().toDateString();
                        return logDate === today && log.status === 'completed';
                    });

                    return (
                        <div key={habit.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {/* Placeholder icon based on name or random */}
                                    📝
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">{habit.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                                        <span className="flex items-center gap-1"><Clock size={14} /> 08:00am</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> Home</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleHabit(habit.id)}
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
