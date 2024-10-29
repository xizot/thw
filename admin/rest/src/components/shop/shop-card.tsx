import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';
import Badge from '@/components/ui/badge/badge';
import { Shop } from '@/types';

type ShopCardProps = {
  shop: Shop;
};

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const { t } = useTranslation();

  return (
    <Link href={`/${shop?.id}`}>
      <div className="relative flex cursor-pointer items-center rounded border border-accent bg-light p-5">
        <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-gray-300">
          <Image
            alt={t('common:text-logo')}
            src={shop?.cover_image! ?? '/product-placeholder-borderless.svg'}
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>

        <div className="ms-4">
          <h3 className="mb-2 text-base font-medium text-heading">
            {shop?.name}
          </h3>
          <span>
            <Badge
              textKey={
                shop?.is_active ? 'common:text-active' : 'common:text-inactive'
              }
              color={shop?.is_active ? 'bg-accent' : 'bg-red-500'}
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
