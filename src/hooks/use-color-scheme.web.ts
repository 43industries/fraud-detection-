import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Web color scheme. Falls back to light when the platform value is unavailable.
 */
export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}
