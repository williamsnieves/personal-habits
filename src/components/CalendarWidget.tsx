"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { CalendarData, getCompletionLevel } from '@/core/domain/calendar';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function CalendarWidget() {
    const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchCalendarData();
    }, [currentMonth, currentYear]);

    const fetchCalendarData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/habits/calendar?month=${currentMonth}&year=${currentYear}`);

            if (!response.ok) {
                throw new Error('Failed to fetch calendar data');
            }

            const data = await response.json();
            setCalendarData(data);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    const getDaysInMonth = () => {
        return new Date(currentYear, currentMonth + 1, 0).getDate();
    };

    const getFirstDayOfMonth = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        // Convert Sunday (0) to 7, and shift Monday to 1
        return firstDay === 0 ? 6 : firstDay - 1;
    };

    const getCompletionData = (day: number) => {
        if (!calendarData) return null;

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return calendarData.days.find(d => d.date === dateStr);
    };

    const getCompletionColor = (count: number) => {
        const level = getCompletionLevel(count);
        switch (level) {
            case 'low': return 'bg-green-100 border-green-400 text-green-700';
            case 'medium': return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            case 'high': return 'bg-red-100 border-red-500 text-red-700 font-bold';
            default: return '';
        }
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth();
        const firstDay = getFirstDayOfMonth();
        const days = [];

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const completionData = getCompletionData(day);
            const hasCompletions = completionData && completionData.completionCount > 0;
            const today = isToday(day);

            days.push(
                <div
                    key={day}
                    className={`
            relative p-2 rounded-lg text-sm font-medium cursor-pointer transition-all
            ${today ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2' : 'hover:bg-gray-100 text-text-primary'}
            ${hasCompletions && !today ? getCompletionColor(completionData.completionCount) : ''}
            ${hasCompletions && !today ? 'border-2' : ''}
          `}
                    title={hasCompletions ? `${completionData.completionCount} habit${completionData.completionCount > 1 ? 's' : ''} completed` : ''}
                >
                    <div className="text-center">{day}</div>
                    {hasCompletions && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                            {Array.from({ length: Math.min(completionData.completionCount, 3) }).map((_, i) => (
                                <div key={i} className={`w-1 h-1 rounded-full ${today ? 'bg-white' : 'bg-current'}`}></div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-soft">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-soft">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">
                    {MONTH_NAMES[currentMonth]}, {currentYear}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Previous month"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-full transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Next month"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            {calendarData && calendarData.stats.currentStreak > 0 && (
                <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp size={16} className="text-orange-500" />
                        <span className="font-bold text-orange-700">{calendarData.stats.currentStreak} day streak!</span>
                        {calendarData.stats.longestStreak > calendarData.stats.currentStreak && (
                            <span className="text-orange-600 text-xs">
                                (Best: {calendarData.stats.longestStreak})
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Day names */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2 font-medium text-text-secondary">
                {DAY_NAMES.map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-text-secondary pt-4 border-t">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded border-2 border-green-400 bg-green-100"></div>
                        <span>1-2</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded border-2 border-yellow-400 bg-yellow-100"></div>
                        <span>3-4</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded border-2 border-red-500 bg-red-100"></div>
                        <span>5+</span>
                    </div>
                </div>
                {calendarData && (
                    <div className="font-medium text-text-primary">
                        {calendarData.stats.completionRate}% active days
                    </div>
                )}
            </div>
        </div>
    );
}
