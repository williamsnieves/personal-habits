import React from 'react';
import { Search, Bell, MessageSquare } from 'lucide-react';

export function Header() {
    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
                    Happy Tuesday <span className="text-2xl">👋</span>
                </h1>
                <p className="text-text-secondary mt-1">30 Dec 2023, 10:03 am</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary w-64"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-text-secondary hover:bg-gray-100 rounded-full transition-colors">
                        <Bell size={20} />
                    </button>
                    <button className="p-2 text-text-secondary hover:bg-gray-100 rounded-full transition-colors">
                        <MessageSquare size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                    </div>
                </div>
            </div>
        </header>
    );
}
