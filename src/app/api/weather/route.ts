import { NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const DEFAULT_CITY = process.env.WEATHER_CITY || 'Madrid';

interface WeatherData {
    temperature: number;
    condition: string;
    emoji: string;
    wind: string;
    pressure: string;
    humidity: string;
    city: string;
}

// GET /api/weather - Fetch current weather
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city') || DEFAULT_CITY;

        console.log('Weather API Debug:', {
            hasApiKey: !!OPENWEATHER_API_KEY,
            apiKeyLength: OPENWEATHER_API_KEY?.length || 0,
            apiKeyPrefix: OPENWEATHER_API_KEY?.substring(0, 8) || 'NOT_SET',
            city,
        });

        if (!OPENWEATHER_API_KEY) {
            return NextResponse.json(
                { error: 'Weather API key not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`,
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenWeatherMap API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData,
                city,
            });
            throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Map weather condition to emoji
        const getWeatherEmoji = (condition: string): string => {
            const lowerCondition = condition.toLowerCase();
            if (lowerCondition.includes('clear')) return '☀️';
            if (lowerCondition.includes('cloud')) return '☁️';
            if (lowerCondition.includes('rain')) return '🌧️';
            if (lowerCondition.includes('snow')) return '❄️';
            if (lowerCondition.includes('thunder')) return '⛈️';
            if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) return '🌫️';
            return '🌤️';
        };

        const weatherData: WeatherData = {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            emoji: getWeatherEmoji(data.weather[0].main),
            wind: `${Math.round(data.wind.speed * 3.6)} km/h`, // Convert m/s to km/h
            pressure: `${data.main.pressure}hPa`,
            humidity: `${data.main.humidity}%`,
            city: data.name,
        };

        return NextResponse.json(weatherData, { status: 200 });
    } catch (error) {
        console.error('Error fetching weather:', error);

        // Fallback to mock data if API fails (useful during development)
        const mockWeather: WeatherData = {
            temperature: 18,
            condition: 'Partly Cloudy',
            emoji: '⛅',
            wind: '12 km/h',
            pressure: '1013hPa',
            humidity: '65%',
            city: 'Madrid (Mock Data)',
        };

        return NextResponse.json(mockWeather, {
            status: 200,
            headers: { 'X-Mock-Data': 'true' }
        });
    }
}
