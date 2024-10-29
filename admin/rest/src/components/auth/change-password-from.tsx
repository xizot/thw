import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { toast } from 'react-toastify';
import PasswordInput from '@/components/ui/password-input';
import { useChangePasswordMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { ChangePasswordDto, ChangePasswordSchema } from 'shop-shared/dist/auth';
import { z } from 'zod';
import Form from '../ui/forms/form';
import Alert from '../ui/alert';
import { useState } from 'react';
import { getErrorResponse } from '@/lib/get-error-response';

const changePasswordSchema = ChangePasswordSchema.extend({
  passwordConfirmation: z.string(),
}).refine((data) => data.newPassword === data.passwordConfirmation, {
  path: ['passwordConfirmation'],
  message: 'form:error-match-passwords',
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const { mutate: changePassword, isLoading: loading } =
    useChangePasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit({
    newPassword,
    oldPassword,
  }: ChangePasswordFormValues) {
    const payload: ChangePasswordDto = { newPassword, oldPassword };
    changePassword(payload, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(t('common:password-changed-successfully'));
          setServerError(null);
        }
      },
      onError: (error) => {
        const { message } = getErrorResponse(error);
        setServerError(message);
      },
    });
  }

  return (
    <Form<ChangePasswordFormValues>
      onSubmit={onSubmit}
      validationSchema={changePasswordSchema}
    >
      {({ register, formState: { errors } }) => (
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:input-label-password')}
            details={t('form:password-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <Alert message={serverError} variant="error" className="mb-5" />
            <PasswordInput
              label={t('form:input-label-old-password')}
              {...register('oldPassword')}
              variant="outline"
              error={t(errors.oldPassword?.message!)}
              className="mb-5"
            />
            <PasswordInput
              label={t('form:input-label-new-password')}
              {...register('newPassword')}
              variant="outline"
              error={t(errors.newPassword?.message!)}
              className="mb-5"
            />
            <PasswordInput
              label={t('form:input-label-confirm-password')}
              {...register('passwordConfirmation')}
              variant="outline"
              error={t(errors.passwordConfirmation?.message!)}
            />
          </Card>

          <div className="w-full text-end">
            <Button loading={loading} disabled={loading}>
              {t('form:button-label-change-password')}
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
};
export default ChangePasswordForm;
