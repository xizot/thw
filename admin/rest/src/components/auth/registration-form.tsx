import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';
import {
  allowedRoles,
  hasAccess,
  setAuthCredentials,
} from '@/utils/auth-utils';
import { CreateUserDto, CreateUserSchema } from 'shop-shared/dist/auth';
import { useRegisterMutation } from '@/data/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { getErrorResponse } from '@/lib/get-error-response';

const RegistrationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(CreateUserSchema),
  });
  const router = useRouter();
  const { t } = useTranslation();

  async function onSubmit({ username, email, password }: CreateUserDto) {
    registerUser(
      {
        username,
        email,
        password,
      },

      {
        onSuccess: (data) => {
          if (data?.token) {
            if (hasAccess(allowedRoles, data?.permissions)) {
              setAuthCredentials(data?.token, data?.permissions);
              router.push(Routes.dashboard);
              return;
            }
          } else {
            setErrorMessage('form:error-credential-wrong');
          }
        },
        onError: (error) => {
          const { message } = getErrorResponse(error);
          setErrorMessage(message);
        },
      }
    );
  }

  return (
    <>
      <Alert message={t(errorMessage)} variant="error" className="mb-4" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label={t('form:input-label-username')}
          {...register('username')}
          variant="outline"
          className="mb-4"
          error={t(errors?.username?.message!)}
        />
        <Input
          label={t('form:input-label-email')}
          {...register('email')}
          type="email"
          variant="outline"
          className="mb-4"
          error={t(errors?.email?.message!)}
        />
        <PasswordInput
          label={t('form:input-label-password')}
          {...register('password')}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-8"
        />
        <Button className="w-full" loading={loading} disabled={loading}>
          {t('form:text-register')}
        </Button>
      </form>
      <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute -top-2.5 bg-light px-2 -ms-4 start-2/4">
          {t('common:text-or')}
        </span>
      </div>
      <div className="text-center text-sm text-body sm:text-base">
        {t('form:text-already-account')}{' '}
        <Link
          href={Routes.login}
          className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          {t('form:button-label-login')}
        </Link>
      </div>
    </>
  );
};

export default RegistrationForm;
