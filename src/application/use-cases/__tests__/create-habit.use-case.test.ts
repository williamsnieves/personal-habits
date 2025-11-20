import { CreateHabitUseCase } from '../create-habit.use-case';
import { HabitRepository, CreateHabitDTO } from '@/core/domain/habit';

// Mock repository
class MockHabitRepository implements Partial<HabitRepository> {
    create = jest.fn();
}

describe('CreateHabitUseCase', () => {
    let useCase: CreateHabitUseCase;
    let mockRepository: MockHabitRepository;

    beforeEach(() => {
        mockRepository = new MockHabitRepository();
        useCase = new CreateHabitUseCase(mockRepository as unknown as HabitRepository);
    });

    describe('execute', () => {
        it('should create a habit successfully with valid data', async () => {
            // Arrange
            const validData: CreateHabitDTO = {
                name: 'Morning Exercise',
                description: 'Exercise for 30 minutes',
                frequency: 'daily',
            };

            const expectedHabit = {
                id: '123',
                ...validData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.create.mockResolvedValue(expectedHabit);

            // Act
            const result = await useCase.execute(validData);

            // Assert
            expect(result).toEqual(expectedHabit);
            expect(mockRepository.create).toHaveBeenCalledWith(validData);
            expect(mockRepository.create).toHaveBeenCalledTimes(1);
        });

        it('should throw error when name is empty', async () => {
            // Arrange
            const invalidData: CreateHabitDTO = {
                name: '',
                frequency: 'daily',
            };

            // Act & Assert
            await expect(useCase.execute(invalidData)).rejects.toThrow('Habit name is required');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error when name is only whitespace', async () => {
            // Arrange
            const invalidData: CreateHabitDTO = {
                name: '   ',
                frequency: 'daily',
            };

            // Act & Assert
            await expect(useCase.execute(invalidData)).rejects.toThrow('Habit name is required');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error when name exceeds 100 characters', async () => {
            // Arrange
            const invalidData: CreateHabitDTO = {
                name: 'a'.repeat(101),
                frequency: 'daily',
            };

            // Act & Assert
            await expect(useCase.execute(invalidData)).rejects.toThrow('Habit name must be less than 100 characters');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        // Parameterized test for different frequencies
        it.each([
            ['daily' as const],
            ['weekly' as const],
        ])('should create habit with %s frequency', async (frequency) => {
            // Arrange
            const validData: CreateHabitDTO = {
                name: 'Test Habit',
                frequency,
            };

            const expectedHabit = {
                id: '123',
                ...validData,
                description: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.create.mockResolvedValue(expectedHabit);

            // Act
            const result = await useCase.execute(validData);

            // Assert
            expect(result.frequency).toBe(frequency);
            expect(mockRepository.create).toHaveBeenCalledWith(validData);
        });
    });
});
