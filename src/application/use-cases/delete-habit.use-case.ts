import { HabitRepository } from '@/core/domain/habit';

export class DeleteHabitUseCase {
    constructor(private habitRepository: HabitRepository) { }

    async execute(id: string): Promise<void> {
        // Verify habit exists
        const existingHabit = await this.habitRepository.findById(id);
        if (!existingHabit) {
            throw new Error('Habit not found');
        }

        // Delete habit
        await this.habitRepository.delete(id);
    }
}
