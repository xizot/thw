import { useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { uploadClient } from '@/data/client/upload';
import { AttachmentsPayload } from '@/types';

export const useUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AttachmentsPayload) => {
      return uploadClient.uploadImage(payload);
    },
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.SETTINGS);
      },
    }
  );
};
