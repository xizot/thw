import OwnerLayout from '@/components/layouts/owner';
import ShopForm from '@/components/shop/shop-form';
import { adminOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateShopPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 sm:pb-8">
        <h1 className="p-0 text-lg font-semibold text-heading">
          {t('form:form-title-create-shop')}
        </h1>
      </div>
      <ShopForm />
    </>
  );
}
CreateShopPage.authenticate = {
  permissions: adminOnly,
};
CreateShopPage.Layout = OwnerLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});
