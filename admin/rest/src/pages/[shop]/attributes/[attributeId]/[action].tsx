import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import CreateOrUpdateAttributeForm from '@/components/attribute/attribute-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@/components/layouts/shop';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useAttributeQuery } from '@/data/attributes';
import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';

export default function UpdateAttributePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { query, locale } = useRouter();
  const { data: shopData } = useShopQuery();
  const shopId = shopData?.id!;

  const {
    data: attributeData,
    isLoading: loading,
    error,
  } = useAttributeQuery({
    slug: query.attributeId as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 sm:pb-8">
        <h1 className="p-0 text-lg font-semibold text-heading">
          {t('form:edit-attribute')}
        </h1>
      </div>
      <CreateOrUpdateAttributeForm initialValues={attributeData} />
    </>
  );
}
UpdateAttributePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
UpdateAttributePage.Layout = ShopLayout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
