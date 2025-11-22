"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Users, ArrowRight } from 'lucide-react';

interface PopularHabit {
    id: string;
    name: string;
    category: string;
    icon: string;
    likes: number;
}

interface ShouldDoCardProps {
    onAddHabit: (name: string) => void;
}

export function ShouldDoCard({ onAddHabit }: ShouldDoCardProps) {
    const [featuredHabit, setFeaturedHabit] = useState<PopularHabit | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch a random popular habit to feature
        const fetchFeatured = async () => {
            try {
                const response = await fetch('/api/habits/popular');
                const data = await response.json();
                // Pick a random one, e.g., the second one for now or random
                const random = data[Math.floor(Math.random() * data.length)];
                setFeaturedHabit(random);
            } catch (error) {
                console.error('Error fetching featured habit:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading || !featuredHabit) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-soft h-full animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-12 bg-gray-100 rounded mb-2"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-soft h-full relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-text-primary">Should Do!</h3>
                    <button className="text-xs text-text-secondary hover:text-primary flex items-center gap-1">
                        View Details <ArrowRight size={12} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-4xl bg-yellow-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        {featuredHabit.icon}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-lg text-text-primary">{featuredHabit.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-text-secondary mt-1">
                            <Users size={12} />
                            <span>{featuredHabit.likes.toLocaleString()} love this</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onAddHabit(featuredHabit.name)}
                    className="mt-4 w-full py-2 bg-gray-50 hover:bg-primary hover:text-white text-text-primary rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={16} />
                    Add to my habits
                </button>
            </div>
        </div>
    );
}
