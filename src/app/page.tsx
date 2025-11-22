"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { HabitList } from '@/components/HabitList';
import { CalendarWidget } from '@/components/CalendarWidget';
import { NewHabitModal } from '@/components/NewHabitModal';
import { WeatherWidget } from '@/components/WeatherWidget';
import { PopularHabitsModal } from '@/components/PopularHabitsModal';
import { ShouldDoCard } from '@/components/ShouldDoCard';
import { SpotifyWidget } from '@/components/SpotifyWidget';
import { AIAssistantCards } from '@/components/AIAssistantCards';
import { Plus } from 'lucide-react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopularModalOpen, setIsPopularModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  const handleAddPopularHabit = async (name: string) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          frequency: 'daily',
          description: 'Added from Popular Habits'
        }),
      });

      if (response.ok) {
        handleSuccess();
      }
    } catch (error) {
      console.error('Error adding popular habit:', error);
    }
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

            <button
              onClick={() => setIsPopularModalOpen(true)}
              className="w-full btn-secondary text-lg"
            >
              Browse Popular Habits
            </button>

            <CalendarWidget />
          </div>

          {/* Middle Column */}
          <div className="xl:col-span-1 space-y-8">
            <WeatherWidget />

            <div className="h-64">
              <ShouldDoCard onAddHabit={handleAddPopularHabit} />
            </div>

            <div className="h-48">
              <AIAssistantCards onAddHabit={handleAddPopularHabit} />
            </div>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-1 space-y-8">
            <HabitList key={refreshKey} />

            <div className="h-48">
              <SpotifyWidget />
            </div>
          </div>
        </div>

        <NewHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />

        <PopularHabitsModal
          isOpen={isPopularModalOpen}
          onClose={() => setIsPopularModalOpen(false)}
          onAddHabit={handleAddPopularHabit}
        />
      </main>
    </div>
  );
}
