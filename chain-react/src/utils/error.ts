import type { GalachainClient } from '@lfginc/gala-connect';

export function checkProvider(provider: GalachainClient | null): provider is GalachainClient {
    if (!provider) {
        throw new Error('You should add <GalaProvider> on the top of the app to use GalaConnect');
    }

    return true;
}
