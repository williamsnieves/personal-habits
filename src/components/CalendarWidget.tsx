import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarWidget() {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentDay = 30; // Mock current day

    return (
        <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">December, 2023</h2>
                <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                    <button className="p-1 bg-primary text-white rounded-full"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2 font-medium text-text-secondary">
                <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
                {/* Offset for start of month (mock) */}
                <div className="p-2"></div>
                <div className="p-2"></div>

                {days.map(day => (
                    <div
                        key={day}
                        className={`p-2 rounded-full text-sm font-medium cursor-pointer transition-colors
              ${day === currentDay ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 text-text-primary'}
              ${day === 10 || day === 22 ? 'border border-primary text-primary' : ''}
            `}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}
