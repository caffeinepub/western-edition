/**
 * Patches the Backend class prototype to add the platform method
 * _initializeAccessControlWithSecret, which is called by useActor.ts
 * (a protected platform file) but not declared in the generated backend.ts.
 *
 * This ensures runtime compatibility without modifying protected files.
 */
import { Backend } from "../backend";

// Add the method to the prototype if it doesn't already exist
if (!("_initializeAccessControlWithSecret" in Backend.prototype)) {
  // biome-ignore lint/suspicious/noExplicitAny: patching protected class
  (Backend.prototype as any)._initializeAccessControlWithSecret = async (
    _token: string,
  ): Promise<void> => {
    // No-op: this platform method is not required for this app's backend
  };
}
