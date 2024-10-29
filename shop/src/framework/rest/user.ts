import { useModalAction } from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { toast } from 'react-toastify';
import client from './client';
import { authorizationAtom } from '@/store/authorization-atom';
import { useAtom } from 'jotai';
import { signOut as socialLoginSignOut } from 'next-auth/react';
import { useToken } from '@/lib/hooks/use-token';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useState } from 'react';
import type { ChangePasswordUserInput, OtpLoginInputType } from '@/types';
import { initialOtpState, optAtom } from '@/components/otp/atom';
import { clearCheckoutAtom } from '@/store/checkout';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { getErrorResponse } from '@/lib/get-error-response';

export function useUser() {
  const [isAuthorized] = useAtom(authorizationAtom);
  const { setEmailVerified, getEmailVerified } = useToken();
  const { emailVerified } = getEmailVerified();
  const router = useRouter();

  const { data, isLoading, error } = useQuery(
    [API_ENDPOINTS.USERS_ME],
    client.users.me,
    {
      enabled: isAuthorized,
      retry: false,
      onSuccess: (data) => {
        if (emailVerified === false) {
          setEmailVerified(true);
          router.reload();
          return;
        }
      },
      onError: (err) => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            setEmailVerified(false);
            router.push(Routes.verifyEmail);
            return;
          }
          if (router.pathname === Routes.verifyEmail) {
            return;
          }
        }
      },
    }
  );
  //TODO: do some improvement here
  return { me: data, isLoading, error, isAuthorized };
}

export const useCreateAddress = () => {
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  return useMutation(client.users.createAddress, {
    onSuccess: (data) => {
      if (data) {
        toast.success('successfully-address-deleted');
        closeModal();
        return;
      }
    },
    onError: (error) => {
      const { message } = getErrorResponse(error);
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
};

export const useUpdateAddress = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  return useMutation(client.users.updateAddress, {
    onSuccess: (data) => {
      if (data) {
        toast.success(t('text-update-address-success'));
        closeModal();
        return;
      }
    },
    onError: (error) => {
      const { message } = getErrorResponse(error);
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
};

export const useDeleteAddress = () => {
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  return useMutation(client.users.deleteAddress, {
    onSuccess: (data) => {
      if (data) {
        toast.success('successfully-address-deleted');
        closeModal();
        return;
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
};
export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation(client.users.updateEmail, {
    onSuccess: (data) => {
      if (data) {
        toast.success(t('successfully-email-updated'));
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
};

export const useUpdateUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();
  return useMutation(client.users.update, {
    onSuccess: (data) => {
      if (data?.id) {
        toast.success(`${t('profile-update-successful')}`);
        closeModal();
      }
    },
    onError: (error) => {
      toast.error(`${t('error-something-wrong')}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
};

export const useContact = () => {
  const { t } = useTranslation('common');

  return useMutation(client.users.contactUs, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${t(data.message)}`);
      } else {
        toast.error(`${t(data.message)}`);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

export function useLogin() {
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useModalAction();
  const { setToken } = useToken();
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.login, {
    onSuccess: (data) => {
      if (!data.token) {
        setServerError('error-credential-wrong');
        return;
      }
      setToken(data.token);
      setAuthorized(true);
      closeModal();
    },
    onError: (error) => {
      const { message } = getErrorResponse(error);
      setServerError(message);
    },
  });

  return { mutate, isLoading, serverError };
}

export function useSocialLogin() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);

  return useMutation(client.users.socialLogin, {
    onSuccess: (data) => {
      if (data?.token && data?.permissions?.length) {
        setToken(data?.token);
        setAuthorized(true);
        return;
      }
      if (!data.token) {
        toast.error(`${t('error-credential-wrong')}`);
      }
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useSendOtpCode({
  verifyOnly,
}: Partial<{ verifyOnly: boolean }> = {}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [otpState, setOtpState] = useAtom(optAtom);

  const { mutate, isLoading } = useMutation(client.users.sendOtpCode, {
    onSuccess: (data) => {
      if (!data.success) {
        setServerError(data.message!);
        return;
      }
      setOtpState({
        ...otpState,
        otpId: data?.id!,
        isContactExist: data?.is_contact_exist!,
        phoneNumber: data?.phone_number!,
        step: data?.is_contact_exist! ? 'OtpForm' : 'RegisterForm',
        ...(verifyOnly && { step: 'OtpForm' }),
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const { message } = getErrorResponse(error);
        setServerError(message);
      }
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useVerifyOtpCode({
  onVerifySuccess,
}: {
  onVerifySuccess: Function;
}) {
  const [otpState, setOtpState] = useAtom(optAtom);
  let [serverError, setServerError] = useState<string | null>(null);
  const { mutate, isLoading } = useMutation(client.users.verifyOtpCode, {
    onSuccess: (data) => {
      if (!data.success) {
        setServerError(data?.message!);
        return;
      }
      if (onVerifySuccess) {
        onVerifySuccess({
          phone_number: otpState.phoneNumber,
        });
      }
      setOtpState({
        ...initialOtpState,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useOtpLogin() {
  const [otpState, setOtpState] = useAtom(optAtom);
  const { t } = useTranslation('common');
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useModalAction();
  const { setToken } = useToken();
  const queryClient = new QueryClient();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate: otpLogin, isLoading } = useMutation(client.users.OtpLogin, {
    onSuccess: (data) => {
      if (!data.token) {
        setServerError('text-otp-verify-failed');
        return;
      }
      setToken(data.token!);
      setAuthorized(true);
      setOtpState({
        ...initialOtpState,
      });
      closeModal();
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
    onSettled: () => {
      queryClient.clear();
    },
  });

  function handleSubmit(input: OtpLoginInputType) {
    otpLogin({
      ...input,
      phone_number: otpState.phoneNumber,
      otp_id: otpState.otpId!,
    });
  }

  return { mutate: handleSubmit, isLoading, serverError, setServerError };
}

export function useRegister() {
  const { t } = useTranslation('common');
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useModalAction();
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.register, {
    onSuccess: (data) => {
      if (data?.token && data?.permissions?.length) {
        setToken(data?.token);
        setAuthorized(true);
        closeModal();
        return;
      }
      if (!data.token) {
        toast.error(`${t('error-credential-wrong')}`);
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const { message } = getErrorResponse(error);
        setServerError(message);
      }
    },
  });

  return { mutate, isLoading, serverError };
}
export function useResendVerificationEmail() {
  const { t } = useTranslation('common');
  const { mutate, isLoading } = useMutation(
    client.users.resendVerificationEmail,
    {
      onSuccess: (data) => {
        if (data?.success) {
          toast.success(t('MESSAGE.EMAIL_SENT_SUCCESSFUL'));
        }
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(data?.message);
      },
    }
  );

  return { mutate, isLoading };
}
export function useLogout() {
  const queryClient = useQueryClient();
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const [_r, resetCheckout] = useAtom(clearCheckoutAtom);

  const { mutate: signOut, isLoading } = useMutation(client.users.logout, {
    onSuccess: (data) => {
      if (data) {
        setToken('');
        setAuthorized(false);
        //@ts-ignore
        resetCheckout();
        queryClient.refetchQueries(API_ENDPOINTS.USERS_ME);
      }
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
  function handleLogout() {
    socialLoginSignOut({ redirect: false });
    signOut();
  }
  return {
    mutate: handleLogout,
    isLoading,
  };
}

export function useChangePassword() {
  const { t } = useTranslation('common');
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.changePassword, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${t('password-successful')}`);
        setServerError(null);
      }
    },
    onError: (error) => {
      const { message } = getErrorResponse(error);
      setServerError(message);
    },
  });

  return { mutate, isLoading, serverError };
}

export function useForgotPassword() {
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.forgotPassword, {
    onSuccess: (data) => {
      if (data?.success) {
        setMessage(data?.message!);
        setServerError(null);
      }
    },
    onError: (error) => {
      const { message } = getErrorResponse(error);
      setServerError(message);
      setMessage(null);
    },
  });

  return { mutate, isLoading, message, serverError, setMessage };
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const { openModal } = useModalAction();
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.resetPassword, {
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Successfully Reset Password!');
        router.push(Routes.home);
        openModal('LOGIN_VIEW');
        return;
      }
    },
    onSettled: () => {
      queryClient.clear();
    },
    onError: (error) => {
      const { message } = getErrorResponse(error);
      setServerError(message);
    },
  });

  return { mutate, isLoading, serverError };
}

export function useVerifyForgotPasswordToken() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState<boolean>(false);

  const { mutate, isLoading } = useMutation(
    client.users.verifyForgotPasswordToken,
    {
      onSuccess: () => {
        setVerifySuccess(true);
      },
      onError: (error) => {
        const { message } = getErrorResponse(error);
        setServerError(message);
      },
    }
  );

  return { mutate, isLoading, serverError, verifySuccess };
}
