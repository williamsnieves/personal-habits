import { UpdateHabitUseCase } from '../update-habit.use-case';
import { HabitRepository, UpdateHabitDTO, Habit } from '@/core/domain/habit';

// Mock repository
class MockHabitRepository implements Partial<HabitRepository> {
    findById = jest.fn();
    update = jest.fn();
}

describe('UpdateHabitUseCase', () => {
    let useCase: UpdateHabitUseCase;
    let mockRepository: MockHabitRepository;

    const existingHabit: Habit = {
        id: '123',
        name: 'Original Name',
        description: 'Original Description',
        frequency: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        mockRepository = new MockHabitRepository();
        useCase = new UpdateHabitUseCase(mockRepository as unknown as HabitRepository);
    });

    describe('execute', () => {
        it('should update habit successfully with valid data', async () => {
            // Arrange
            const updateData: UpdateHabitDTO = {
                name: 'Updated Name',
                description: 'Updated Description',
            };

            const updatedHabit = { ...existingHabit, ...updateData };

            mockRepository.findById.mockResolvedValue(existingHabit);
            mockRepository.update.mockResolvedValue(updatedHabit);

            // Act
            const result = await useCase.execute('123', updateData);

            // Assert
            expect(result).toEqual(updatedHabit);
            expect(mockRepository.findById).toHaveBeenCalledWith('123');
            expect(mockRepository.update).toHaveBeenCalledWith('123', updateData);
        });

        it('should throw error when habit not found', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(useCase.execute('999', { name: 'Test' })).rejects.toThrow('Habit not found');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error when name is empty string', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(existingHabit);

            // Act & Assert
            await expect(useCase.execute('123', { name: '' })).rejects.toThrow('Habit name cannot be empty');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error when name exceeds 100 characters', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(existingHabit);

            // Act & Assert
            await expect(useCase.execute('123', { name: 'a'.repeat(101) })).rejects.toThrow('Habit name must be less than 100 characters');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });
    });
});
