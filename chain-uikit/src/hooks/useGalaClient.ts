import { GalaConnectContext } from '../components/GalaProvider';
import { checkProvider, isServerSide } from '../utils';
import type { GalachainClient } from '@lfginc/gala-connect';
import { useContext } from 'react';

export const useGalaClient = (): [GalachainClient] => {
    const client = useContext(GalaConnectContext);

    if (isServerSide()) {
        return [null as unknown as GalachainClient];
    }

    checkProvider(client);
    return [client!];
};
