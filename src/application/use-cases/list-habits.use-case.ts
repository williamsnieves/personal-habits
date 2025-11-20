import { Habit, HabitRepository } from '@/core/domain/habit';

export class ListHabitsUseCase {
    constructor(private habitRepository: HabitRepository) { }

    async execute(): Promise<Habit[]> {
        // Fetch all habits
        const habits = await this.habitRepository.findAll();

        // Business logic: Sort by creation date (newest first)
        return habits.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
}
