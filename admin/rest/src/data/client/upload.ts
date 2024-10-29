import { HttpClient } from './http-client';
import { API_ENDPOINTS } from './api-endpoints';
import { Attachment, AttachmentsPayload } from '@/types';

export const uploadClient = {
  uploadImage: async (payload: AttachmentsPayload) => {
    const formData = new FormData();
    formData.append('field', payload.field);
    formData.append('attachment', payload.attachment);
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return HttpClient.post<Attachment>(
      API_ENDPOINTS.ATTACHMENTS,
      formData,
      options
    );
  },
};
