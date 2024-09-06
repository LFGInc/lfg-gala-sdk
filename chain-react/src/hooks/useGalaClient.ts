import { GalaConnectContext } from '@/components';
import { checkProvider, isServerSide } from '@/utils';
import type { GalachainClient } from '@gala-chain/connect/src';
import { useContext } from 'react';

export const useGalaClient = (): [GalachainClient] => {
    const client = useContext(GalaConnectContext);

    if (isServerSide()) {
        return [null as unknown as GalachainClient];
    }

    checkProvider(client);
    return [client!];
};
