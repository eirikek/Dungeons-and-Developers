import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

/**
 * Test environment setup for Vitest and React Testing Library.
 *
 * This file configures the global test environment, ensuring consistent test behavior.
 * It includes utilities for cleaning up after each test and mocking specific browser APIs
 * such as `IntersectionObserver`.
 *
 * Key functionalities:
 * - Automatically invokes `cleanup()` from React Testing Library after each test to unmount components and prevent memory leaks.
 * - Provides a mock implementation of the `IntersectionObserver` API for testing scenarios
 *   where this API is used (e.g., infinite scrolling, lazy loading).
 *
 * IntersectionObserver Mock:
 * - The `IntersectionObserver` class is mocked with `vi.fn()` to allow testing components
 *   that rely on this browser API without needing a real browser environment.
 *
 * @global
 * @class IntersectionObserver
 * @method observe - Mock method to simulate observing an element.
 * @method disconnect - Mock method to simulate disconnecting the observer.
 * @method unobserve - Mock method to simulate unobserving an element.
 *
 * Usage:
 * - Add to vite.config.ts - setupFiles
 *
 * Example:
 * ```ts
 * import './setup.ts';
 * ```
 */
class IntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

// Mock the IntersectionObserver API in both the `window` and `global` objects.
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});
