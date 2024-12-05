import { createContext } from 'react';
import { ToastContextType } from '../interfaces/ToastContextProps.ts';

/**
 * ToastContext
 *
 * Provides a context for managing toast notifications.
 *
 * Features:
 * - Displays toast notifications with customizable messages, types, and durations.
 * - Supports undo actions and manual toast closure.
 * - Ensures a consistent interface for triggering toast notifications across the application.
 *
 * Interfaces:
 * - `ToastProps`: Defines the properties of a toast notification.
 * - `ToastContextType`: Describes the methods and state exposed by the ToastContext.
 */

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
