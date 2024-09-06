import { createContext, memo } from 'react';

import { GalachainClient } from '@gala-chain/connect/src/index';
import { ClientFactory } from '@gala-chain/connect/src/ClientFactory';

import { isClientSide } from '@/utils';

export interface IGalaConnectConfigs {
    chainCodeUrl: string;
}

let galaClient: GalachainClient | null = null;

export const GalaConnectContext = createContext<GalachainClient | null>(null);

const GalaProvider: React.FC<{ config: IGalaConnectConfigs; children?: React.ReactNode }> = ({
    children,
    config
}) => {
    if (isClientSide() && !galaClient) {
        galaClient = new ClientFactory().galachainClient(config.chainCodeUrl);
    }

    return <GalaConnectContext.Provider value={galaClient}>{children}</GalaConnectContext.Provider>;
};

export default memo(GalaProvider);
