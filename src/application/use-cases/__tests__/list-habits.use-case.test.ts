import { ListHabitsUseCase } from '../list-habits.use-case';
import { HabitRepository, Habit } from '@/core/domain/habit';

// Mock repository
class MockHabitRepository implements Partial<HabitRepository> {
    findAll = jest.fn();
}

describe('ListHabitsUseCase', () => {
    let useCase: ListHabitsUseCase;
    let mockRepository: MockHabitRepository;

    beforeEach(() => {
        mockRepository = new MockHabitRepository();
        useCase = new ListHabitsUseCase(mockRepository as unknown as HabitRepository);
    });

    describe('execute', () => {
        it('should return empty array when no habits exist', async () => {
            // Arrange
            mockRepository.findAll.mockResolvedValue([]);

            // Act
            const result = await useCase.execute();

            // Assert
            expect(result).toEqual([]);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it('should return habits sorted by creation date (newest first)', async () => {
            // Arrange
            const oldDate = new Date('2024-01-01');
            const newDate = new Date('2024-01-02');

            const habits: Habit[] = [
                {
                    id: '1',
                    name: 'Old Habit',
                    description: null,
                    frequency: 'daily',
                    createdAt: oldDate,
                    updatedAt: oldDate,
                },
                {
                    id: '2',
                    name: 'New Habit',
                    description: null,
                    frequency: 'daily',
                    createdAt: newDate,
                    updatedAt: newDate,
                },
            ];

            mockRepository.findAll.mockResolvedValue(habits);

            // Act
            const result = await useCase.execute();

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('2'); // Newest first
            expect(result[1].id).toBe('1');
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it('should handle habits with same creation date', async () => {
            // Arrange
            const sameDate = new Date('2024-01-01');

            const habits: Habit[] = [
                {
                    id: '1',
                    name: 'Habit 1',
                    description: null,
                    frequency: 'daily',
                    createdAt: sameDate,
                    updatedAt: sameDate,
                },
                {
                    id: '2',
                    name: 'Habit 2',
                    description: null,
                    frequency: 'weekly',
                    createdAt: sameDate,
                    updatedAt: sameDate,
                },
            ];

            mockRepository.findAll.mockResolvedValue(habits);

            // Act
            const result = await useCase.execute();

            // Assert
            expect(result).toHaveLength(2);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });
});
