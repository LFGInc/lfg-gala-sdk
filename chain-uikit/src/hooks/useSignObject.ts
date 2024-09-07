import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGalaClient } from './useGalaClient';

export const useSignObject = () => {
    const [client] = useGalaClient();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: object) => {
            return client.signObject(payload);
        },
        onSuccess: data => {
            queryClient.setQueryData(['galaConnectedAddress'], data);
        },
        onError: () => {
            queryClient.setQueryData(['galaConnectedAddress'], null);
        }
    });
};
