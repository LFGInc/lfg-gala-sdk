import { createContext, memo } from 'react';

import { ClientFactory, GalachainClient } from '@lfginc/gala-connect';

import { isClientSide } from '../utils';

export interface IGalaConnectConfigs {
    chainCodeUrl: string;
}

let galaClient: GalachainClient | null = null;

export const GalaConnectContext = createContext<GalachainClient | null>(null);

const GalaProvider: IComponent<{ config: IGalaConnectConfigs; children?: React.ReactNode }> = ({
    children,
    config
}) => {
    if (isClientSide() && !galaClient) {
        galaClient = ClientFactory.lfgwClient(config.chainCodeUrl);
    }

    return <GalaConnectContext.Provider value={galaClient}>{children}</GalaConnectContext.Provider>;
};

export default memo(GalaProvider);
