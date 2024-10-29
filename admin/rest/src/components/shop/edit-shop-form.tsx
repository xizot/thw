import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import FileInput from '@/components/ui/file-input';
import TextArea from '@/components/ui/text-area';
import { useUpdateShopMutation } from '@/data/shop';
import { AttachmentsPayload, Shop, ShopSocialInput } from '@/types';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import Label from '@/components/ui/label';
import { getIcon } from '@/utils/get-icon';
import SelectInput from '@/components/ui/select-input';
import * as socialIcons from '@/components/icons/social';
import SwitchInput from '@/components/ui/switch-input';
import { getAuthCredentials } from '@/utils/auth-utils';
import { SUPER_ADMIN, STORE_OWNER } from '@/utils/constants';
import { UpdateShopDto, UpdateShopSchema } from 'shop-shared/dist/shop';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useOwnersQuery } from '@/data/user';
import { IOptions } from '@/types/component';
import { z } from 'zod';
import { useUploadMutation } from '@/data/upload';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

const editShopSchema = UpdateShopSchema.extend({
  logo: z.any(),
  coverImage: z.any(),
});

interface FormValues extends UpdateShopDto {
  logo: File;
  coverImage: File;
}

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

const EditShopForm = ({ initialValues }: { initialValues: Shop }) => {
  const { t } = useTranslation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();

  const { owners } = useOwnersQuery();
  const {
    mutate: upload,
    isLoading: loadingUpload,
    isSuccess,
  } = useUploadMutation();

  // let permission = hasAccess(adminAndOwnerOnly, permissions);
  const { permissions } = getAuthCredentials();

  const { address, description, name, owner } = initialValues!;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      address,
      description,
      name,
      owner: Number(owner?.id),
    },
    resolver: zodResolver(editShopSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'settings.socials',
  });
  const [ownerOptions, setOwnerOptions] = useState<IOptions[]>([]);

  function onSubmit(formValues: FormValues) {
    const { address, description, paymentInfo, settings, name } = formValues;
    const logoAttachment = _get(formValues, 'logo[0]');
    const coverImageAttachment = _get(formValues, 'coverImage[0]');
    if (logoAttachment) {
      const logoPayload: AttachmentsPayload = {
        field: 'shop.logo',
        attachment: logoAttachment,
      };
      upload(logoPayload);
    }
    if (coverImageAttachment) {
      const coverPayload: AttachmentsPayload = {
        field: 'shop.cover',
        attachment: coverImageAttachment,
      };
      upload(coverPayload);
    }

    const updateShopPayload: UpdateShopDto = {
      address,
      description,
      name,
      paymentInfo,
      settings,
    };
    updateShop({
      payload: updateShopPayload,
      id: Number(initialValues.id),
    });
  }

  const coverImageInformation = (
    <span>
      {t('form:shop-cover-image-help-text')} <br />
      {t('form:cover-image-dimension-help-text')} &nbsp;
      <span className="font-bold">1170 x 435{t('common:text-px')}</span>
    </span>
  );

  useEffect(() => {
    if (owners) {
      const options: IOptions[] = owners.map((user) => ({
        label: user.username,
        value: user.id,
      }));
      setOwnerOptions(options);
      setValue('owner', Number(owner?.id));
    }
  }, [owners]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(t('text-upload-success'));
    }
  }, [isSuccess]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:input-label-logo')}
            details={t('form:shop-logo-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="logo" control={control} multiple={false} />
          </Card>
        </div>

        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:shop-cover-image-title')}
            details={coverImageInformation}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="coverImage" control={control} multiple={false} />
          </Card>
        </div>
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

            {!owner ? (
              <SelectInput
                label={t('form:input-label-owner')}
                control={control}
                name="owner"
                options={ownerOptions}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                error={t(errors.owner?.message!)}
              />
            ) : null}

            <TextArea
              label={t('form:input-label-description')}
              {...register('description')}
              variant="outline"
              error={t(errors.description?.message!)}
              className="mt-5"
            />
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:shop-payment-info')}
            details={t('form:payment-info-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-account-holder-name')}
              {...register('paymentInfo.name')}
              variant="outline"
              className="mb-5"
              error={t(errors.paymentInfo?.name?.message!)}
            />
            <Input
              label={t('form:input-label-account-holder-email')}
              {...register('paymentInfo.email')}
              variant="outline"
              className="mb-5"
              error={t(errors?.paymentInfo?.email?.message!)}
            />
            <Input
              label={t('form:input-label-bank-name')}
              {...register('paymentInfo.bank')}
              variant="outline"
              className="mb-5"
              error={t(errors?.paymentInfo?.bank?.message!)}
            />
            <Input
              label={t('form:input-label-account-number')}
              {...register('paymentInfo.account')}
              variant="outline"
              error={t(errors?.paymentInfo?.account?.message!)}
            />
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:shop-address')}
            details={t('form:shop-address-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-country')}
              {...register('address.country')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.country?.message!)}
            />
            <Input
              label={t('form:input-label-city')}
              {...register('address.city')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.city?.message!)}
            />
            <Input
              label={t('form:input-label-state')}
              {...register('address.state')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.state?.message!)}
            />
            <Input
              label={t('form:input-label-zip')}
              {...register('address.zip')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.zip?.message!)}
            />
            <TextArea
              label={t('form:input-label-street-address')}
              {...register('address.street_address')}
              variant="outline"
              error={t(errors.address?.street_address?.message!)}
            />
          </Card>
        </div>

        {permissions?.includes(STORE_OWNER) ? (
          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:form-notification-title')}
              details={t('form:form-notification-description')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
              <Input
                label={t('form:input-notification-email')}
                {...register('paymentInfo.email')}
                error={t(errors.paymentInfo?.email?.message!)}
                variant="outline"
                className="mb-5"
                disabled={permissions?.includes(SUPER_ADMIN)}
                type="email"
              />
              <div className="flex items-center gap-x-4">
                <SwitchInput
                  name="settings.notifications.enable"
                  control={control}
                  disabled={permissions?.includes(SUPER_ADMIN)}
                />
                <Label className="mb-0">
                  {t('form:input-enable-notification')}
                </Label>
              </div>
            </Card>
          </div>
        ) : (
          ''
        )}
        <div className="my-5 flex flex-wrap border-b border-dashed border-gray-300 pb-8 sm:my-8">
          <Description
            title={t('form:shop-settings')}
            details={t('form:shop-settings-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="mb-5">
              <Label>{t('form:input-label-autocomplete')}</Label>
              <Controller
                control={control}
                name="settings.location"
                render={({ field: { onChange } }) => (
                  <GooglePlacesAutocomplete
                    onChange={onChange}
                    data={getValues('settings.location')!}
                  />
                )}
              />
            </div>
            <Input
              label={t('form:input-label-contact')}
              {...register('settings.contact')}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.contact?.message!)}
            />
            <Input
              label={t('form:input-label-website')}
              {...register('settings.website')}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.website?.message!)}
            />
            <div>
              {fields.map(
                (item: ShopSocialInput & { id: string }, index: number) => (
                  <div
                    className="border-b border-dashed border-border-200 py-5 first:mt-5 first:border-t last:border-b-0 md:py-8 md:first:mt-10"
                    key={item.id}
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                      <div className="sm:col-span-2">
                        <Label>{t('form:input-label-select-platform')}</Label>
                        <SelectInput
                          name={`settings.socials.${index}.icon` as const}
                          control={control}
                          options={updatedIcons}
                          isClearable={true}
                          defaultValue={item?.icon!}
                        />
                      </div>
                      {/* <Input
                        className="sm:col-span-2"
                        label={t("form:input-label-icon")}
                        variant="outline"
                        {...register(`settings.socials.${index}.icon` as const)}
                        defaultValue={item?.icon!} // make sure to set up defaultValue
                      /> */}
                      <Input
                        className="sm:col-span-2"
                        label={t('form:input-label-url')}
                        variant="outline"
                        {...register(`settings.socials.${index}.url` as const)}
                        defaultValue={item.url!} // make sure to set up defaultValue
                      />
                      <button
                        onClick={() => {
                          remove(index);
                        }}
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                      >
                        {t('form:button-label-remove')}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            <Button
              type="button"
              onClick={() => append({ icon: '', url: '' })}
              className="w-full sm:w-auto"
            >
              {t('form:button-label-add-social')}
            </Button>
          </Card>
        </div>

        <div className="mb-5 text-end">
          <Button
            loading={updating || loadingUpload}
            disabled={updating || loadingUpload}
          >
            {t('form:button-label-update')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditShopForm;
