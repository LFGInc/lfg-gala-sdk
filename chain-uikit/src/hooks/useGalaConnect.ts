import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGalaClient } from './useGalaClient';

export const useGalaConnect = () => {
    const [client] = useGalaClient();
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['galaConnectedAddress'],
        mutationFn: async () => {
            await client.connect();
            return client.getGalachainAddress;
        },
        onSuccess: data => {
            queryClient.setQueryData(['galaConnectedAddress'], data);
        },
        onError: () => {
            queryClient.setQueryData(['galaConnectedAddress'], null);
        }
    });
};
