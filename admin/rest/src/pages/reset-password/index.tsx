import EnterNewPasswordView from '@/components/auth/forget-password/enter-new-password-view';
import AuthPageLayout from '@/components/layouts/auth-layout';
import { useResetPasswordMutation } from '@/data/user';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { ResetPasswordDto } from 'shop-shared/dist/auth';
import _toString from 'lodash/toString';
import { useRouter } from 'next/router';
import { getErrorResponse } from '@/lib/get-error-response';
import { useState } from 'react';
import Alert from '@/components/ui/alert';

export default function ResetPasswordPage() {
  const router = useRouter();
  const tokenQuery = _toString(router.query.token);

  const { t } = useTranslation();
  const { mutate: resetPassword, isLoading: resetting } =
    useResetPasswordMutation();

  const [serverError, setServerError] = useState<string | null>(null);

  function handleResetPassword({ password, email }: ResetPasswordDto) {
    resetPassword(
      {
        email,
        token: tokenQuery,
        password,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: (error) => {
          const { message } = getErrorResponse(error);
          setServerError(message);
        },
      }
    );
  }

  return (
    <AuthPageLayout>
      <h3 className="mb-6 mt-4 text-center text-base text-body">
        {t('form:form-title-reset-password')}
      </h3>

      <Alert message={serverError} variant="error" className="mb-5" />
      <EnterNewPasswordView
        loading={resetting}
        onSubmit={handleResetPassword}
        token={tokenQuery}
      />
    </AuthPageLayout>
  );
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
