import { getLayout as getSiteLayout } from '@/components/layouts/layout';
import { PasswordForm } from '@/components/auth/forgot-password';
import { useRouter } from 'next/router';
import { useResetPassword } from '@/framework/user';
import { SubmitHandler } from 'react-hook-form';
import { ResetPasswordDto } from 'shop-shared/dist/auth';
import _toString from 'lodash/toString';
export { getStaticProps } from '@/framework/manufacturers-page.ssr';

export default function ResetPasswordPage() {
  const router = useRouter();
  const tokenQuery = _toString(router.query.token);

  const {
    mutate: resetPassword,
    isLoading: resetting,
    serverError,
  } = useResetPassword();

  const onSubmit: SubmitHandler<ResetPasswordDto> = ({ email, password }) => {
    if (tokenQuery) {
      const payload: ResetPasswordDto = {
        password: _toString(password),
        email: _toString(email),
        token: tokenQuery,
      };
      resetPassword(payload);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-md">
      <PasswordForm
        onSubmit={onSubmit}
        isLoading={resetting}
        serverError={serverError}
        token={tokenQuery}
      />
    </div>
  );
}

const getLayout = (page: React.ReactElement) =>
  getSiteLayout(
    <div className="w-full bg-light">
      <div className="mx-auto min-h-screen max-w-1920 px-5 py-10 xl:py-14 xl:px-16">
        {page}
      </div>
    </div>
  );

ResetPasswordPage.getLayout = getLayout;
