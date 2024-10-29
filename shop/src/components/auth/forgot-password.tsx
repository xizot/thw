import type { SubmitHandler } from 'react-hook-form';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Button from '@/components/ui/button';

import { useModalAction } from '@/components/ui/modal/modal.context';
import PasswordInput from '@/components/ui/forms/password-input';
import { useForgotPassword } from '@/framework/user';
import { useTranslation } from 'next-i18next';
import Logo from '@/components/ui/logo';
import Alert from '../ui/alert';
import {
  ForgetPasswordSchema,
  ForgetPasswordDto,
  ResetPasswordSchema,
  ResetPasswordDto,
} from 'shop-shared/dist/auth';
import _toString from 'lodash/toString';

function EmailForm() {
  const { t } = useTranslation('common');

  const {
    mutate: forgotPassword,
    isLoading,
    message,
    serverError,
  } = useForgotPassword();

  const onSubmit: SubmitHandler<ForgetPasswordDto> = ({ email }) => {
    forgotPassword({ email: _toString(email) });
  };

  return (
    <>
      <Alert message={serverError} variant="error" className="mb-5" />
      <Alert message={message} variant="success" className="mb-5" />

      <Form<ForgetPasswordDto>
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: { email: '' },
        }}
        validationSchema={ForgetPasswordSchema}
        serverError={serverError && t(serverError)}
        className="text-left"
      >
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={t('text-email')}
              type="email"
              {...register('email')}
              error={t(errors.email?.message!)}
            />
            <Button
              type="submit"
              className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-6"
              loading={isLoading}
              disabled={isLoading}
            >
              {t('text-submit-email')}
            </Button>
          </>
        )}
      </Form>
    </>
  );
}

export function PasswordForm({
  onSubmit,
  isLoading,
  serverError,
  token,
}: {
  onSubmit: SubmitHandler<ResetPasswordDto>;
  isLoading: boolean;
  serverError: string | null;
  token: string | undefined;
}) {
  const { t } = useTranslation('common');
  return (
    <>
      <Form<ResetPasswordDto>
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: { password: '', email: '' },
        }}
        validationSchema={ResetPasswordSchema}
        resetValues={{ token }}
      >
        {({ register, formState: { errors } }) => (
          <>
            <h2 className="mb-5 text-center text-xl font-medium text-heading">
              {t('set-new-password')}
            </h2>
            <Alert message={serverError} className="mb-5" variant="error" />
            <Input
              label={t('text-email')}
              {...register('email')}
              className="mb-5"
              error={t(errors.email?.message!)}
              type="email"
            />
            <PasswordInput
              label={t('text-new-password')}
              {...register('password')}
              error={t(errors.password?.message!)}
            />

            <div className="mt-5">
              <Button
                className="w-full text-sm tracking-[0.2px] sm:order-2"
                loading={isLoading}
                disabled={isLoading || !token}
                type="submit"
              >
                {t('text-reset-password')}
              </Button>
            </div>
          </>
        )}
      </Form>
    </>
  );
}

export default function ForgotUserPassword() {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light py-6 px-5 sm:p-8 md:h-auto md:min-h-0 md:max-w-[480px] md:rounded-xl">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="mt-4 mb-7 text-center leading-relaxed text-body sm:mt-5">
        {t('forgot-password-helper')}
      </p>

      <EmailForm />

      <div className="relative mt-9 mb-7 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="start-2/4 -ms-4 absolute -top-2.5 bg-light px-2">
          {t('text-or')}
        </span>
      </div>
      <div className="text-center text-sm text-body sm:text-base">
        {t('text-back-to')}{' '}
        <button
          onClick={() => openModal('LOGIN_VIEW')}
          className="ms-1 font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover hover:no-underline focus:text-accent-hover focus:no-underline focus:outline-0"
        >
          {t('text-login')}
        </button>
      </div>
    </div>
  );
}
