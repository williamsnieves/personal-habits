"use client";

import React, { useEffect, useState } from 'react';
import { Sparkles, Lightbulb, ArrowRight, Plus } from 'lucide-react';

interface AISuggestion {
    id: string;
    type: 'insight' | 'suggestion';
    title: string;
    description: string;
    icon: string;
    action?: string;
}

interface AIAssistantCardsProps {
    onAddHabit: (name: string) => void;
}

export function AIAssistantCards({ onAddHabit }: AIAssistantCardsProps) {
    const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/ai/suggestions', { method: 'POST' });
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching AI suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextCard = () => {
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-soft h-48 animate-pulse flex flex-col justify-between">
                <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (suggestions.length === 0) return null;

    const currentCard = suggestions[activeIndex];

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-soft relative overflow-hidden h-full flex flex-col justify-between group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={64} className="text-indigo-500" />
            </div>

            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
                        <Sparkles size={16} />
                        AI Insight
                    </div>
                    <div className="flex gap-1">
                        {suggestions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === activeIndex ? 'bg-indigo-500' : 'bg-indigo-200'}`}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="text-3xl bg-white p-2 rounded-xl shadow-sm">
                        {currentCard.icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary text-lg leading-tight mb-1">
                            {currentCard.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {currentCard.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                {currentCard.action ? (
                    <button
                        onClick={() => onAddHabit(currentCard.action!)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
                    >
                        <Plus size={16} />
                        {currentCard.action}
                    </button>
                ) : (
                    <div></div> // Spacer
                )}

                <button
                    onClick={nextCard}
                    className="text-xs text-text-secondary hover:text-indigo-600 flex items-center gap-1 transition-colors"
                >
                    Next Insight <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
}
