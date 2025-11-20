import React from 'react';
import { LayoutDashboard, Calendar, Settings, LogOut } from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="w-20 lg:w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col py-8 z-10 transition-all duration-300">
            <div className="flex items-center justify-center lg:justify-start lg:px-8 mb-12">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    H
                </div>
                <span className="hidden lg:block ml-3 font-bold text-xl text-text-primary">Hebats</span>
            </div>

            <nav className="flex-1 flex flex-col gap-2 px-4">
                <a href="#" className="flex items-center gap-4 px-4 py-3 bg-primary-light text-primary rounded-xl font-medium transition-colors">
                    <LayoutDashboard size={20} />
                    <span className="hidden lg:block">Dashboard</span>
                </a>
                <a href="#" className="flex items-center gap-4 px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-xl font-medium transition-colors">
                    <Calendar size={20} />
                    <span className="hidden lg:block">Schedule</span>
                </a>
                <a href="#" className="flex items-center gap-4 px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-xl font-medium transition-colors">
                    <Settings size={20} />
                    <span className="hidden lg:block">Settings</span>
                </a>
            </nav>

            <div className="px-4 mt-auto">
                <button className="w-full flex items-center gap-4 px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-xl font-medium transition-colors">
                    <LogOut size={20} />
                    <span className="hidden lg:block">Logout</span>
                </button>
            </div>
        </aside>
    );
}
