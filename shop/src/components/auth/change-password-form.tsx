import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/forms/password-input';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import { useChangePassword } from '@/framework/user';
import { ChangePasswordDto, ChangePasswordSchema } from 'shop-shared/dist/auth';
import { z } from 'zod';
import Alert from '../ui/alert';

const changePasswordSchema = ChangePasswordSchema.extend({
  passwordConfirmation: z.string(),
}).refine((data) => data.newPassword === data.passwordConfirmation, {
  path: ['passwordConfirmation'],
  message: "Password confirmation doesn't match",
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const { t } = useTranslation('common');
  const {
    mutate: changePassword,
    isLoading: loading,
    serverError,
  } = useChangePassword();

  function onSubmit({ newPassword, oldPassword }: ChangePasswordFormValues) {
    const payload: ChangePasswordDto = { newPassword, oldPassword };
    changePassword(payload);
  }

  return (
    <>
      <Alert message={serverError} variant="error" className="mb-5" />
      <Form<ChangePasswordFormValues>
        onSubmit={onSubmit}
        validationSchema={changePasswordSchema}
        className="flex flex-col"
      >
        {({ register, formState: { errors } }) => (
          <>
            <PasswordInput
              label={t('text-old-password')}
              {...register('oldPassword')}
              error={t(errors.oldPassword?.message!)}
              className="mb-5"
              variant="outline"
            />
            <PasswordInput
              label={t('text-new-password')}
              {...register('newPassword')}
              error={t(errors.newPassword?.message!)}
              className="mb-5"
              variant="outline"
            />
            <PasswordInput
              label={t('text-confirm-password')}
              {...register('passwordConfirmation')}
              error={t(errors.passwordConfirmation?.message!)}
              className="mb-5"
              variant="outline"
            />
            <Button
              loading={loading}
              disabled={loading}
              className="ltr:ml-auto rtl:mr-auto"
            >
              {t('text-submit')}
            </Button>
          </>
        )}
      </Form>
    </>
  );
}
