import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HabitList } from '../HabitList';
import * as useHabitsModule from '@/hooks/useHabits';

// Mock the useHabits hook
jest.mock('@/hooks/useHabits');

describe('HabitList', () => {
    const mockUseHabits = useHabitsModule.useHabits as jest.MockedFunction<typeof useHabitsModule.useHabits>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Loading State', () => {
        it('should show loading skeleton initially', () => {
            // Arrange
            mockUseHabits.mockReturnValue({
                habits: [],
                loading: true,
                error: null,
                fetchHabits: jest.fn(),
                createHabit: jest.fn(),
                updateHabit: jest.fn(),
                deleteHabit: jest.fn(),
                logHabit: jest.fn(),
            });

            // Act
            render(<HabitList />);

            // Assert
            const skeletons = screen.getAllByRole('generic').filter(el =>
                el.className.includes('animate-pulse')
            );
            expect(skeletons.length).toBeGreaterThan(0);
        });
    });

    describe('Empty State', () => {
        it('should show empty message when no habits exist', () => {
            // Arrange
            mockUseHabits.mockReturnValue({
                habits: [],
                loading: false,
                error: null,
                fetchHabits: jest.fn(),
                createHabit: jest.fn(),
                updateHabit: jest.fn(),
                deleteHabit: jest.fn(),
                logHabit: jest.fn(),
            });

            // Act
            render(<HabitList />);

            // Assert
            expect(screen.getByText('No habits yet. Create one to get started!')).toBeInTheDocument();
        });
    });

    describe('Habit Rendering', () => {
        it('should render habits when data is fetched', () => {
            // Arrange
            const mockHabits = [
                {
                    id: '1',
                    name: 'Morning Exercise',
                    description: 'Exercise for 30 minutes',
                    frequency: 'daily' as const,
                    logs: [],
                },
                {
                    id: '2',
                    name: 'Read Book',
                    description: 'Read for 20 minutes',
                    frequency: 'daily' as const,
                    logs: [],
                },
            ];

            mockUseHabits.mockReturnValue({
                habits: mockHabits,
                loading: false,
                error: null,
                fetchHabits: jest.fn(),
                createHabit: jest.fn(),
                updateHabit: jest.fn(),
                deleteHabit: jest.fn(),
                logHabit: jest.fn(),
            });

            // Act
            render(<HabitList />);

            // Assert
            expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
            expect(screen.getByText('Read Book')).toBeInTheDocument();
        });

        it('should show habit as completed when log exists for today', () => {
            // Arrange
            const today = new Date();
            const mockHabits = [
                {
                    id: '1',
                    name: 'Morning Exercise',
                    description: 'Exercise',
                    frequency: 'daily' as const,
                    logs: [{ id: 'log1', habitId: '1', date: today, status: 'completed' as const }],
                },
            ];

            mockUseHabits.mockReturnValue({
                habits: mockHabits,
                loading: false,
                error: null,
                fetchHabits: jest.fn(),
                createHabit: jest.fn(),
                updateHabit: jest.fn(),
                deleteHabit: jest.fn(),
                logHabit: jest.fn(),
            });

            // Act
            render(<HabitList />);

            // Assert
            expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
            // The checkbox button should have green background when completed
            const buttons = screen.getAllByRole('button');
            const checkbox = buttons[buttons.length - 1]; // Last button is the checkbox
            expect(checkbox.className).toContain('bg-green-500');
        });
    });

    describe('Habit Completion Toggle', () => {
        it('should call logHabit when habit checkbox is clicked', async () => {
            // Arrange
            const mockLogHabit = jest.fn().mockResolvedValue({});
            const mockHabits = [
                {
                    id: '1',
                    name: 'Morning Exercise',
                    description: 'Exercise',
                    frequency: 'daily' as const,
                    logs: [],
                },
            ];

            mockUseHabits.mockReturnValue({
                habits: mockHabits,
                loading: false,
                error: null,
                fetchHabits: jest.fn(),
                createHabit: jest.fn(),
                updateHabit: jest.fn(),
                deleteHabit: jest.fn(),
                logHabit: mockLogHabit,
            });

            render(<HabitList />);

            // Act
            const buttons = screen.getAllByRole('button');
            const checkbox = buttons[buttons.length - 1]; // Last button is the checkbox
            fireEvent.click(checkbox);

            // Assert
            await waitFor(() => {
                expect(mockLogHabit).toHaveBeenCalledWith(
                    '1',
                    expect.any(Date),
                    'completed'
                );
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle fetch errors gracefully', () => {
            // Arrange
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            const mockLogHabit = jest.fn().mockRejectedValue(new Error('Network error'));

            mockUseHabits.mockReturnValue({
                habits: [{
                    id: '1',
                    name: 'Morning Exercise',
                    description: 'Exercise',
                    frequency: 'daily' as const,
                    logs: [],
                }],
                loading: false,
                error: null,
                fetchHabits: jest.fn(),
                createHabit: jest.fn(),
                updateHabit: jest.fn(),
                deleteHabit: jest.fn(),
                logHabit: mockLogHabit,
            });

            render(<HabitList />);

            // Act
            const buttons = screen.getAllByRole('button');
            const checkbox = buttons[buttons.length - 1];
            fireEvent.click(checkbox);

            // Assert
            waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'Failed to log habit',
                    expect.any(Error)
                );
            });

            consoleErrorSpy.mockRestore();
        });
    });
});
