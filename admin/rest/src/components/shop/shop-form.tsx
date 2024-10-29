import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useCreateShopMutation } from '@/data/shop';
import { getIcon } from '@/utils/get-icon';
import SelectInput from '@/components/ui/select-input';
import * as socialIcons from '@/components/icons/social';
import { CreateShopDto, CreateShopSchema } from 'shop-shared/dist/shop';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useOwnersQuery } from '@/data/user';
import { IOptions } from '@/types/component';

const socialIcon = [
  {
    value: 'FacebookIcon',
    label: 'Facebook',
  },
  {
    value: 'InstagramIcon',
    label: 'Instagram',
  },
  {
    value: 'TwitterIcon',
    label: 'Twitter',
  },
  {
    value: 'YouTubeIcon',
    label: 'Youtube',
  },
];

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center text-body space-s-4">
      <span className="flex h-4 w-4 items-center justify-center">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

const ShopForm = () => {
  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();

  const { owners } = useOwnersQuery();

  // let permission = hasAccess(adminAndOwnerOnly, permissions);

  const {
    register,
    handleSubmit,
    formState: { errors },

    control,
  } = useForm<CreateShopDto>({
    shouldUnregister: true,
    resolver: zodResolver(CreateShopSchema),
  });

  const { t } = useTranslation();
  const [ownerOptions, setOwnerOptions] = useState<IOptions[]>([]);

  function onSubmit(formValues: CreateShopDto) {
    createShop(formValues);
  }

  useEffect(() => {
    if (owners) {
      const options: IOptions[] = owners.map((user) => ({
        label: user.username,
        value: user.id,
      }));
      setOwnerOptions(options);
    }
  }, [owners]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:shop-basic-info')}
            details={t('form:shop-basic-info-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-shop-name')}
              {...register('name')}
              variant="outline"
              className="mb-5"
              error={t(errors.name?.message!)}
            />

            <SelectInput
              label={t('form:input-label-owner')}
              control={control}
              name="owner"
              options={ownerOptions}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              error={t(errors.owner?.message!)}
            />
          </Card>
        </div>

        <div className="mb-5 text-end">
          <Button loading={creating} disabled={creating}>
            {t('form:button-label-save')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ShopForm;
