import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useUpdateUserEmailMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import _pick from 'lodash/pick';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';

type FormValues = {
  email: string;
};

export default function EmailUpdateForm({ me }: any) {
  const { t } = useTranslation();
  const { mutate: updateEmail, isLoading: loading } =
    useUpdateUserEmailMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      ...(me && _pick(me, ['email'])),
    },
  });

  async function onSubmit(values: FormValues) {
    const { email } = values;
    updateEmail({
      email: email,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('common:text-email')}
          details=""
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            error={t(errors.email?.message!)}
            variant="outline"
            className="mb-5"
            readOnly
          />
        </Card>
      </div>
    </form>
  );
}
