import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HabitList } from '../HabitList';

// Mock fetch
global.fetch = jest.fn();

describe('HabitList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockClear();
    });

    describe('Loading State', () => {
        it('should show loading message initially', () => {
            // Arrange
            (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => { })); // Never resolves

            // Act
            render(<HabitList />);

            // Assert
            expect(screen.getByText('Loading habits...')).toBeInTheDocument();
        });
    });

    describe('Empty State', () => {
        it('should show empty message when no habits exist', async () => {
            // Arrange
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

            // Act
            render(<HabitList />);

            // Assert
            await waitFor(() => {
                expect(screen.getByText('No habits yet. Create one to get started!')).toBeInTheDocument();
            });
        });
    });

    describe('Habit Rendering', () => {
        it('should render habits when data is fetched', async () => {
            // Arrange
            const mockHabits = [
                {
                    id: '1',
                    name: 'Morning Exercise',
                    description: 'Exercise for 30 minutes',
                    frequency: 'daily',
                    logs: [],
                },
                {
                    id: '2',
                    name: 'Read Book',
                    description: 'Read for 20 minutes',
                    frequency: 'daily',
                    logs: [],
                },
            ];

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockHabits,
            });

            // Act
            render(<HabitList />);

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
                expect(screen.getByText('Read Book')).toBeInTheDocument();
            });
        });

        it('should show habit as completed when log exists for today', async () => {
            // Arrange
            const today = new Date().toISOString();
            const mockHabits = [
                {
                    id: '1',
                    name: 'Morning Exercise',
                    description: 'Exercise',
                    frequency: 'daily',
                    logs: [{ date: today, status: 'completed' }],
                },
            ];

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockHabits,
            });

            // Act
            render(<HabitList />);

            // Assert
            await waitFor(() => {
                expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
                // The checkbox button should have green background when completed
                const buttons = screen.getAllByRole('button');
                const checkbox = buttons[buttons.length - 1]; // Last button is the checkbox
                expect(checkbox.className).toContain('bg-green-500');
            });
        });
    });

    describe('Habit Completion Toggle', () => {
        it('should call API when habit checkbox is clicked', async () => {
            // Arrange
            const mockHabits = [
                {
                    id: '1',
                    name: 'Morning Exercise',
                    description: 'Exercise',
                    frequency: 'daily',
                    logs: [],
                },
            ];

            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockHabits,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ id: 'log1', habitId: '1', status: 'completed' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockHabits,
                });

            render(<HabitList />);

            await waitFor(() => {
                expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
            });

            // Act
            const buttons = screen.getAllByRole('button');
            const checkbox = buttons[buttons.length - 1]; // Last button is the checkbox
            fireEvent.click(checkbox);

            // Assert
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/habits/1/log',
                    expect.objectContaining({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: expect.stringContaining('"status":"completed"'),
                    })
                );
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle fetch errors gracefully', async () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            // Act
            render(<HabitList />);

            // Assert
            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'Failed to fetch habits',
                    expect.any(Error)
                );
            });

            consoleErrorSpy.mockRestore();
        });
    });
});
