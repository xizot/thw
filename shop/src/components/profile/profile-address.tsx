import { useModalAction } from '@/components/ui/modal/modal.context';
import AddressCard from '@/components/address/address-card';
import { AddressHeader } from '@/components/address/address-header';
import { useTranslation } from 'next-i18next';
import { AddressType } from '@/framework/utils/constants';
import { Address } from '@/types';

interface AddressesProps {
  addresses: Address[] | undefined;
  label: string;
  className?: string;
  userId: string;
}

export const ProfileAddressGrid: React.FC<AddressesProps> = ({
  addresses,
  label,
  className,
  userId,
}) => {
  const { openModal } = useModalAction();
  const { t } = useTranslation('common');

  //TODO: no address found
  function onAdd() {
    openModal('ADD_ADDRESS', {
      customerId: userId,
      type: AddressType.Billing,
    });
  }

  return (
    <div className={className}>
      <AddressHeader onAdd={onAdd} count={false} label={label} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {addresses?.map((address) => (
          <AddressCard
            checked={address.default}
            address={address}
            key={address.id}
          />
        ))}

        {!Boolean(addresses?.length) && (
          <span className="rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-sm">
            {t('text-no-address')}
          </span>
        )}
      </div>
    </div>
  );
};
export default ProfileAddressGrid;
