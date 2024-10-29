import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { toast } from 'react-toastify';
import { shopClient } from './client/shop';
import { mapPaginatorData } from '@/utils/data-mappers';
import { useRouter } from 'next/router';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { Shop, ShopPaginator, ShopQueryOptions } from '@/types';
import { getErrorResponse } from '@/lib/get-error-response';
import { userClient } from './client/user';

export const useApproveShopMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(shopClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
    },
  });
};

export const useDisApproveShopMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(shopClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
    },
  });
};

export const useCreateShopMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isLoading, isError } = useMutation(shopClient.create, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      if (hasAccess(adminOnly, permissions)) {
        return router.push(Routes.adminMyShops);
      }
      router.push(Routes.dashboard);
    },
    onError: (error) => {
      const { message } = getErrorResponse(error);
      toast.error(message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
    },
  });
  return { mutate, isLoading, isError };
};

export const useUpdateShopMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(shopClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
    },
  });
};

export const useShopQuery = () => {
  return useQuery<Shop, Error>([API_ENDPOINTS.SHOPS], () =>
    userClient.fetchShop()
  );
};

export const useShopsQuery = (options: Partial<ShopQueryOptions>) => {
  const { data, error, isLoading } = useQuery<ShopPaginator, Error>(
    [API_ENDPOINTS.SHOPS, options],
    ({ queryKey, pageParam }) =>
      shopClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    shops: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
