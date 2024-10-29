import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { siteSettings } from '@/settings/site.settings';
import {
  Category,
  MappedPaginatorInfo,
  Profile,
  SortOrder,
  User,
  UserPaginator,
} from '@/types';
import { useMeQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Permission } from 'shop-shared/dist/auth';
import cn from 'classnames';
import { colorsPermission, translatePermission } from '@/constants/common';

type IProps = {
  customers: User[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CustomerList = ({
  customers,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: any | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: any | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );

      onOrder(column);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-avatar'),
      dataIndex: 'profile',
      key: 'profile',
      align: 'center',
      width: 74,
      render: (profile: Profile, record: any) => (
        <Image
          src={profile?.avatar ?? siteSettings.avatar.placeholder}
          alt={record?.name}
          width={42}
          height={42}
          className="overflow-hidden object-cover"
        />
      ),
    },
    {
      title: t('table:table-item-title'),
      dataIndex: 'username',
      key: 'username',
      align: alignLeft,
    },
    {
      title: t('table:table-item-email'),
      dataIndex: 'email',
      key: 'email',
      align: alignLeft,
    },
    {
      title: t('table:table-item-permissions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center',
      render: (permissions: Permission[]) => {
        return (
          <div className="flex flex-wrap justify-center gap-x-2">
            {permissions?.map((permission, index) => (
              <span
                className={cn(
                  'text-sm capitalize',
                  colorsPermission[permission]
                )}
                key={index}
              >
                {t(translatePermission[permission])}
                {permissions.length > 1 && ','}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      title: t('table:table-item-available_wallet_points'),
      dataIndex: ['wallet', 'available_points'],
      key: 'available_wallet_points',
      align: 'center',
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'is_active'
          }
          isActive={sortingObj.column === 'is_active'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (is_active: boolean) => (is_active ? 'Active' : 'Inactive'),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right',
      render: function Render(id: string, { is_active }: any) {
        const { data } = useMeQuery();
        return (
          <>
            {data?.id != id && (
              <ActionButtons
                id={id}
                userStatus={true}
                isUserActive={is_active}
                showAddWalletPoints={true}
                showMakeAdminButton={true}
              />
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={customers}
          rowKey="id"
          scroll={{ x: 800 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default CustomerList;
