import { useMutation } from 'react-query';
import client from './client';

export const useAttachments = () => {
  const { mutate, isLoading, isError } = useMutation(
    client.attachments.upload,
    {
      onSuccess: (data) => {
        //
      },
      onError: (error) => {
        // toast.error(`${t('error -something-wrong')}`);
      },
      onSettled: () => {
        // queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
      },
    }
  );

  return { mutate, isLoading, isError };
};
