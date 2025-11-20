import { HabitLog, HabitRepository, LogHabitDTO } from '@/core/domain/habit';

export class LogHabitUseCase {
    constructor(private habitRepository: HabitRepository) { }

    async execute(habitId: string, data: LogHabitDTO): Promise<HabitLog> {
        // Verify habit exists
        const existingHabit = await this.habitRepository.findById(habitId);
        if (!existingHabit) {
            throw new Error('Habit not found');
        }

        // Log completion
        return await this.habitRepository.logCompletion(habitId, data);
    }
}
