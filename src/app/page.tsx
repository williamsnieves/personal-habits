"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { HabitList } from '@/components/HabitList';
import { CalendarWidget } from '@/components/CalendarWidget';
import { NewHabitModal } from '@/components/NewHabitModal';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Plus } from 'lucide-react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 ml-20 lg:ml-64 p-8">
        <Header />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-1 space-y-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full btn-primary text-lg shadow-lg shadow-primary/30"
            >
              <Plus size={24} />
              New Habits
            </button>

            <button className="w-full btn-secondary text-lg">
              Browse Popular Habits
            </button>

            <CalendarWidget />
          </div>

          {/* Middle Column */}
          <div className="xl:col-span-1 space-y-8">
            <WeatherWidget />

            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-text-primary">Should Do!</h3>
                <button className="text-xs text-text-secondary">View Details</button>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                <div className="text-2xl">💪</div>
                <div>
                  <div className="font-bold text-text-primary">We go jimmm!!</div>
                  <div className="text-xs text-text-secondary">4.2k love this</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-1 space-y-8">
            <HabitList key={refreshKey} />

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                  Spotify
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">Connect your<br />Spotify account</h3>
                </div>
              </div>
              <p className="text-xs text-text-secondary mb-4">Empower yourself with habit tracking while enjoying uninterrupted music</p>
              <button className="w-full bg-black text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors">
                Link Account
              </button>
            </div>
          </div>
        </div>

        <NewHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </main>
    </div>
  );
}
