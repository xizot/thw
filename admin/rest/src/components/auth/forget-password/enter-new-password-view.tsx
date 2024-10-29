import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/password-input';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema, ResetPasswordDto } from 'shop-shared/dist/auth';
import Input from '@/components/ui/input';
interface Props {
  onSubmit: (values: ResetPasswordDto) => void;
  loading: boolean;
  token: string;
}

const EnterNewPasswordView = ({ onSubmit, loading, token }: Props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      token,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label={t('text-email')}
        {...register('email')}
        className="mb-5"
        error={t(errors.email?.message!)}
        type="email"
      />
      <PasswordInput
        label={t('form:input-label-password')}
        {...register('password')}
        error={t(errors.password?.message!)}
        variant="outline"
        className="mb-5"
      />

      <Button
        className="h-11 w-full"
        loading={loading}
        disabled={loading || !token}
      >
        {t('form:text-reset-password')}
      </Button>
    </form>
  );
};

export default EnterNewPasswordView;
