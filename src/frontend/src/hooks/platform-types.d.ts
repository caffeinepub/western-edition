/**
 * This file exists to document the pre-existing TypeScript error in useActor.ts.
 *
 * useActor.ts (a protected platform file) calls actor._initializeAccessControlWithSecret()
 * but backendInterface (in backend.d.ts, also a protected file) doesn't declare this method.
 * This is a pre-existing platform issue that cannot be fixed by modifying protected files.
 *
 * The Vite build succeeds correctly - only tsc --noEmit reports this error.
 */
export {};
