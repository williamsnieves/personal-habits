"use client";

import React, { useEffect, useState } from 'react';

interface WeatherData {
    temperature: number;
    condition: string;
    emoji: string;
    wind: string;
    pressure: string;
    humidity: string;
    city: string;
}

export function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/weather');

                if (!response.ok) {
                    throw new Error('Failed to fetch weather');
                }

                const data = await response.json();
                setWeather(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching weather:', err);
                setError('Unable to load weather');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();

        // Refresh every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 shadow-soft relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h3 className="font-bold text-text-primary">Weather</h3>
                        <div className="mt-4 text-text-secondary">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 shadow-soft relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h3 className="font-bold text-text-primary">Weather</h3>
                        <div className="mt-4 text-sm text-red-500">{error || 'No data available'}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 shadow-soft relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h3 className="font-bold text-text-primary">Weather</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-4xl">{weather.emoji}</span>
                        <div>
                            <div className="text-3xl font-bold text-text-primary">{weather.temperature}°C</div>
                            <div className="text-xs text-text-secondary">{weather.condition}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 text-xs text-text-secondary relative z-10">
                <div>
                    <div className="font-bold text-text-primary">Wind</div>
                    <div>{weather.wind}</div>
                </div>
                <div>
                    <div className="font-bold text-text-primary">Pressure</div>
                    <div>{weather.pressure}</div>
                </div>
                <div>
                    <div className="font-bold text-text-primary">Humidity</div>
                    <div>{weather.humidity}</div>
                </div>
            </div>
        </div>
    );
}
