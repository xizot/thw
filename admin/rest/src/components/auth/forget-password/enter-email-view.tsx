import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { ForgetPasswordSchema, ForgetPasswordDto } from 'shop-shared/dist/auth';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  onSubmit: (values: ForgetPasswordDto) => void;
  loading: boolean;
}

const EnterEmailView = ({ onSubmit, loading }: Props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordDto>({
    resolver: zodResolver(ForgetPasswordSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label={t('form:input-label-email')}
        {...register('email')}
        type="email"
        variant="outline"
        className="mb-6"
        error={t(errors.email?.message!)}
      />
      <Button className="w-full" loading={loading} disabled={loading}>
        {t('form:text-submit-email')}
      </Button>
    </form>
  );
};

export default EnterEmailView;
