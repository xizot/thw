import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@/components/layouts/shop';
import {
  adminOnly,
  getAuthCredentials,
  hasAccess,
  ownerOnly,
} from '@/utils/auth-utils';
import { useShopQuery } from '@/data/shop';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import EditShopForm from '@/components/shop/edit-shop-form';

export default function UpdateShopPage() {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { t } = useTranslation();
  const { data: shopData, isLoading: loading, error } = useShopQuery();

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopData?.id) &&
    me?.managed_shop?.id != shopData?.id
  ) {
    router.replace(Routes.dashboard);
  }
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 sm:pb-8">
        <h1 className="p-0 text-lg font-semibold text-heading">
          {t('form:form-title-edit-shop')}
        </h1>
      </div>
      <EditShopForm initialValues={shopData!} />
    </>
  );
}
UpdateShopPage.authenticate = {
  permissions: ownerOnly,
};

UpdateShopPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
