import { Habit, HabitRepository, UpdateHabitDTO } from '@/core/domain/habit';

export class UpdateHabitUseCase {
    constructor(private habitRepository: HabitRepository) { }

    async execute(id: string, data: UpdateHabitDTO): Promise<Habit> {
        // Verify habit exists
        const existingHabit = await this.habitRepository.findById(id);
        if (!existingHabit) {
            throw new Error('Habit not found');
        }

        // Business logic validation
        if (data.name !== undefined && data.name.trim().length === 0) {
            throw new Error('Habit name cannot be empty');
        }

        if (data.name && data.name.length > 100) {
            throw new Error('Habit name must be less than 100 characters');
        }

        // Update habit
        return await this.habitRepository.update(id, data);
    }
}
