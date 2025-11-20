import { Habit, HabitRepository, CreateHabitDTO } from '@/core/domain/habit';

export class CreateHabitUseCase {
    constructor(private habitRepository: HabitRepository) { }

    async execute(data: CreateHabitDTO): Promise<Habit> {
        // Business logic validation
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Habit name is required');
        }

        if (data.name.length > 100) {
            throw new Error('Habit name must be less than 100 characters');
        }

        // Create habit through repository
        return await this.habitRepository.create(data);
    }
}
