import { NextResponse } from 'next/server';
import { AppError, ValidationError } from '@/core/errors/AppError';
import { ZodError, ZodSchema } from 'zod';

/**
 * Centralized error handler for API routes
 * Converts domain errors to appropriate HTTP responses
 */
export function handleApiError(error: unknown): NextResponse {
    // Handle known AppError instances
    if (error instanceof AppError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.statusCode }
        );
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                details: error.format()
            },
            { status: 400 }
        );
    }

    // Handle unknown errors
    console.error('Unexpected error:', error);
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
}

/**
 * Validates request body against a Zod schema
 * Throws ValidationError if validation fails
 */
export function validateRequest<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new ValidationError('Invalid request data');
    }
    return result.data;
}
