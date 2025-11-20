import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewHabitModal } from '../NewHabitModal';

// Mock fetch
global.fetch = jest.fn();

describe('NewHabitModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockClear();
    });

    describe('Modal Visibility', () => {
        it('should not render when isOpen is false', () => {
            // Arrange & Act
            const { container } = render(
                <NewHabitModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />
            );

            // Assert
            expect(container.firstChild).toBeNull();
        });

        it('should render when isOpen is true', () => {
            // Arrange & Act
            render(<NewHabitModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

            // Assert
            expect(screen.getByText('New Habit')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('e.g., Morning Exercise')).toBeInTheDocument();
        });

        it('should call onClose when close button is clicked', () => {
            // Arrange
            render(<NewHabitModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

            // Act
            // The X button is the first button in the modal
            const buttons = screen.getAllByRole('button');
            const closeButton = buttons[0]; // X button is first
            fireEvent.click(closeButton);

            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when cancel button is clicked', () => {
            // Arrange
            render(<NewHabitModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

            // Act
            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            fireEvent.click(cancelButton);

            // Assert
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('Form Submission', () => {
        it('should submit form with valid data and call onSuccess', async () => {
            // Arrange
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: '123', name: 'Test Habit' }),
            });

            render(<NewHabitModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

            // Act
            const nameInput = screen.getByPlaceholderText('e.g., Morning Exercise');
            const descriptionInput = screen.getByPlaceholderText('Add some details about this habit...');
            const dailyButton = screen.getByRole('button', { name: /daily/i });
            const submitButton = screen.getByRole('button', { name: /create habit/i });

            fireEvent.change(nameInput, { target: { value: 'Morning Exercise' } });
            fireEvent.change(descriptionInput, { target: { value: 'Exercise for 30 minutes' } });
            fireEvent.click(dailyButton);
            fireEvent.click(submitButton);

            // Assert
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith('/api/habits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Morning Exercise',
                        description: 'Exercise for 30 minutes',
                        frequency: 'daily',
                    }),
                });
                expect(mockOnSuccess).toHaveBeenCalledTimes(1);
                expect(mockOnClose).toHaveBeenCalledTimes(1);
            });
        });

        it('should disable submit button when name is empty', () => {
            // Arrange
            render(<NewHabitModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

            // Act
            const submitButton = screen.getByRole('button', { name: /create habit/i });

            // Assert
            expect(submitButton).toBeDisabled();
        });

        it('should enable submit button when name is filled', () => {
            // Arrange
            render(<NewHabitModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

            // Act
            const nameInput = screen.getByPlaceholderText('e.g., Morning Exercise');
            fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
            const submitButton = screen.getByRole('button', { name: /create habit/i });

            // Assert
            expect(submitButton).not.toBeDisabled();
        });
    });

    describe('Frequency Selection', () => {
        it.each([
            ['daily', 'Daily'],
            ['weekly', 'Weekly'],
        ])('should select %s frequency when %s button is clicked', async (frequency, buttonText) => {
            // Arrange
            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
            render(<NewHabitModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

            // Act
            const nameInput = screen.getByPlaceholderText('e.g., Morning Exercise');
            fireEvent.change(nameInput, { target: { value: 'Test Habit' } });

            const frequencyButton = screen.getByRole('button', { name: buttonText });
            fireEvent.click(frequencyButton);

            const submitButton = screen.getByRole('button', { name: /create habit/i });
            fireEvent.click(submitButton);

            // Assert
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/habits',
                    expect.objectContaining({
                        body: expect.stringContaining(`"frequency":"${frequency}"`),
                    })
                );
            });
        });
    });
});
