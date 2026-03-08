/**
 * Platform type augmentations.
 *
 * useActor.ts (protected) calls actor._initializeAccessControlWithSecret()
 * on the backendInterface. Both useActor.ts and backend.ts are protected files.
 *
 * Solution: Add the method to both `backendInterface` and `Backend` class
 * so TypeScript is satisfied on both sides (interface requires it, class has it).
 * The actual runtime implementation is added via prototype patching in backendPatch.ts.
 */

// Must be a module for declaration merging to work
export {};

declare module "/home/ubuntu/workspace/src/frontend/src/backend" {
  interface backendInterface {
    // biome-ignore lint/style/useNamingConvention: platform internal method
    _initializeAccessControlWithSecret(token: string): Promise<void>;
  }

  interface Backend {
    // biome-ignore lint/style/useNamingConvention: platform internal method (added via prototype patch in backendPatch.ts)
    _initializeAccessControlWithSecret(token: string): Promise<void>;
  }
}
