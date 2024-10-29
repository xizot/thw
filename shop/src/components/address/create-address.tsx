import Button from '@/components/ui/button';
import Input from '@/components/ui/forms/input';
import Label from '@/components/ui/forms/label';
import Radio from '@/components/ui/forms/radio/radio';
// import { Controller } from 'react-hook-form';
import TextArea from '@/components/ui/forms/text-area';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import { AddressType } from '@/framework/utils/constants';
import { GoogleMapLocation } from '@/types';
import { useCreateAddress, useUpdateUser } from '@/framework/user';
// import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
// import { useSettings } from '@/framework/settings';
import {
  CreateAddressDto,
  CreateAddressSchema,
} from 'shop-shared/dist/addresses';
import Checkbox from '../ui/forms/checkbox/checkbox';
import _toString from 'lodash/toString';
import _get from 'lodash/get';

export const CreateAddressForm: React.FC = () => {
  const { t } = useTranslation('common');

  const { mutate: addAddress, isLoading } = useCreateAddress();

  const onSubmit = (values: Partial<CreateAddressDto>) => {
    const payload: CreateAddressDto = {
      city: _toString(values.city),
      country: _toString(values.country),
      default: !!values.default,
      state: _toString(values.state),
      street_address: _toString(values.street_address),
      title: _toString(values.title),
      type: values.type!,
      zip: _toString(values.zip),
    };
    addAddress(payload);
  };

  return (
    <Form<CreateAddressDto>
      onSubmit={onSubmit}
      className="grid h-full w-full grid-cols-2 gap-5"
      validationSchema={CreateAddressSchema}
      useFormProps={{
        shouldUnregister: true,
      }}
    >
      {({ register, control, getValues, setValue, formState: { errors } }) => {
        return (
          <>
            <Input
              label={t('text-title')}
              {...register('title')}
              error={t(errors.title?.message!)}
              variant="outline"
              className="col-span-2"
            />
            {/* {settings?.useGoogleMap && (
              <div className="col-span-2">
                <Label>{t('text-location')}</Label>
                <Controller
                  control={control}
                  name="location"
                  render={({ field: { onChange } }) => (
                    <GooglePlacesAutocomplete
                      onChange={(location: any) => {
                        onChange(location);
                        setValue('address.country', location?.country);
                        setValue('address.city', location?.city);
                        setValue('address.state', location?.state);
                        setValue('address.zip', location?.zip);
                        setValue(
                          'address.street_address',
                          location?.street_address
                        );
                      }}
                      data={getValues('location')!}
                    />
                  )}
                />
              </div>
            )} */}

            <Input
              label={t('text-country')}
              {...register('country')}
              error={t(errors.country?.message!)}
              variant="outline"
            />

            <Input
              label={t('text-city')}
              {...register('city')}
              error={t(errors.city?.message!)}
              variant="outline"
            />

            <Input
              label={t('text-state')}
              {...register('state')}
              error={t(errors?.state?.message!)}
              variant="outline"
            />

            <Input
              label={t('text-zip')}
              {...register('zip')}
              error={t(errors?.zip?.message!)}
              variant="outline"
            />

            <TextArea
              label={t('text-street-address')}
              {...register('street_address')}
              error={t(errors?.street_address?.message!)}
              variant="outline"
              className="col-span-2"
            />

            <div>
              <div className="flex w-full items-baseline">
                <Label className="!mb-0 mr-4">{t('text-type')}</Label>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Radio
                    id="billing"
                    {...register('type')}
                    type="radio"
                    value={AddressType.Billing}
                    label={t('text-billing')}
                    defaultChecked
                  />
                  <Radio
                    id="shipping"
                    {...register('type')}
                    type="radio"
                    value={AddressType.Shipping}
                    label={t('text-shipping')}
                  />
                </div>
              </div>

              <div className="mt-4 flex w-full items-center">
                <Label className="!mb-0 mr-4" htmlFor="default">
                  {t('text-default')}
                </Label>
                <Checkbox {...register('default')} id="default" />
              </div>
            </div>

            <Button
              className="col-span-2 w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {t('text-add-address')}
            </Button>
          </>
        );
      }}
    </Form>
  );
};

export default function CreateAddress() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen w-full bg-light p-5 xs:w-full sm:p-8 md:min-h-0 md:w-[576px] md:rounded-xl">
      <h2 className="mb-4 text-center text-lg font-semibold text-heading sm:mb-6">
        {t('text-add-address')}
      </h2>
      <CreateAddressForm />
    </div>
  );
}
