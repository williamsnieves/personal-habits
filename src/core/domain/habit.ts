// Domain Entity
export interface Habit {
    id: string;
    name: string;
    description: string | null;
    frequency: 'daily' | 'weekly';
    createdAt: Date;
    updatedAt: Date;
}

export interface HabitLog {
    id: string;
    habitId: string;
    date: Date;
    status: 'completed' | 'skipped';
    createdAt: Date;
}

// Repository Interface (Port)
export interface HabitRepository {
    create(data: CreateHabitDTO): Promise<Habit>;
    findAll(): Promise<Habit[]>;
    findById(id: string): Promise<Habit | null>;
    update(id: string, data: UpdateHabitDTO): Promise<Habit>;
    delete(id: string): Promise<void>;
    logCompletion(habitId: string, data: LogHabitDTO): Promise<HabitLog>;
}

// DTOs
export interface CreateHabitDTO {
    name: string;
    description?: string;
    frequency: 'daily' | 'weekly';
}

export interface UpdateHabitDTO {
    name?: string;
    description?: string;
    frequency?: 'daily' | 'weekly';
}

export interface LogHabitDTO {
    date: Date;
    status: 'completed' | 'skipped';
}
