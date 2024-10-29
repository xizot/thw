import { useState } from 'react';
import Alert from '@/components/ui/alert';
import { useForgetPasswordMutation } from '@/data/user';
import dynamic from 'next/dynamic';
import { getErrorResponse } from '@/lib/get-error-response';
import { ForgetPasswordDto } from 'shop-shared/dist/auth';
import _toString from 'lodash/toString';

const EnterEmailView = dynamic(() => import('./enter-email-view'));

const ForgotPassword = () => {
  const { mutate: forgetPassword, isLoading } = useForgetPasswordMutation();

  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleEmailSubmit({ email }: ForgetPasswordDto) {
    forgetPassword(
      { email: _toString(email) },
      {
        onSuccess: (data) => {
          setMessage(data.message);
          setServerError(null);
        },
        onError: (error) => {
          const { message } = getErrorResponse(error);
          setServerError(message);
          setMessage(null);
        },
      }
    );
  }

  return (
    <>
      <Alert variant="error" message={serverError} className="mb-6" />
      <Alert variant="success" message={message} className="mb-6" />

      <EnterEmailView loading={isLoading} onSubmit={handleEmailSubmit} />
    </>
  );
};

export default ForgotPassword;
