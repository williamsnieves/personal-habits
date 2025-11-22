"use client";

import React, { useEffect, useState } from 'react';
import { X, Plus, TrendingUp, Activity, BookOpen, Brain, CheckCircle } from 'lucide-react';

interface PopularHabit {
    id: string;
    name: string;
    category: 'Health' | 'Productivity' | 'Mindfulness' | 'Learning' | 'Fitness';
    icon: string;
    likes: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface PopularHabitsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddHabit: (name: string) => void;
}

const CATEGORIES = ['All', 'Health', 'Fitness', 'Productivity', 'Mindfulness', 'Learning'];

export function PopularHabitsModal({ isOpen, onClose, onAddHabit }: PopularHabitsModalProps) {
    const [habits, setHabits] = useState<PopularHabit[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [addingId, setAddingId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchPopularHabits();
        }
    }, [isOpen]);

    const fetchPopularHabits = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/habits/popular');
            const data = await response.json();
            setHabits(data);
        } catch (error) {
            console.error('Error fetching popular habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (habit: PopularHabit) => {
        setAddingId(habit.id);
        await onAddHabit(habit.name);
        // Simulate a small delay for visual feedback
        setTimeout(() => {
            setAddingId(null);
        }, 1000);
    };

    const filteredHabits = selectedCategory === 'All'
        ? habits
        : habits.filter(h => h.category === selectedCategory);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-orange-50 to-white">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                            <TrendingUp className="text-primary" />
                            Popular Habits
                        </h2>
                        <p className="text-text-secondary text-sm">Discover what others are tracking</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-text-secondary" />
                    </button>
                </div>

                {/* Categories */}
                <div className="p-4 border-b overflow-x-auto flex gap-2 no-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${selectedCategory === cat
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}
              `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredHabits.map(habit => (
                                <div
                                    key={habit.id}
                                    className="border rounded-2xl p-4 hover:shadow-md transition-all group bg-white hover:border-primary/30"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="text-3xl bg-gray-50 p-2 rounded-xl">{habit.icon}</div>
                                            <div>
                                                <h3 className="font-bold text-text-primary">{habit.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{habit.category}</span>
                                                    <span>•</span>
                                                    <span>{habit.likes.toLocaleString()} users</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAdd(habit)}
                                            disabled={addingId === habit.id}
                                            className={`p-2 rounded-full transition-all ${addingId === habit.id
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                                }`}
                                        >
                                            {addingId === habit.id ? <CheckCircle size={20} /> : <Plus size={20} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
