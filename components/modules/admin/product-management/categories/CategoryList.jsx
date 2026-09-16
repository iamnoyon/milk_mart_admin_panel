"use client";

import CardLayout from '@/components/common/CardLayout';
import { useEffect, useMemo, useState } from 'react';
import { Plus, List, SquarePen } from 'lucide-react';
import { useLazyGetCategoryListQuery } from '@/store/admin/category';
import ReactTable from '@/components/common/ReactTable/ReactTable';
import { createColumnHelper } from '@tanstack/react-table';
import TableSkeleton from '@/components/common/ReactTable/TableSkeleton';
import { useRouter } from 'next/navigation';

const columnHelper = createColumnHelper();

const CategoryList = () => {
    const router = useRouter();
    const [pageAndLimit, setPageAndLimit] = useState({ page: 1, limit: 10 });
    const [searchQuery, setSearchQuery] = useState('');

    const [triggerList, { data: categoryData, isLoading }] = useLazyGetCategoryListQuery();

    useEffect(() => {
        triggerList({
            page: pageAndLimit.page,
            limit: pageAndLimit.limit,
        });
    }, [pageAndLimit]);

    const columns = useMemo(
        () => [
            columnHelper.accessor('sl', {
                id: 'sl',
                header: () => 'SL No.',
                cell: (info) => (
                    <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                        {info.row.index + 1}
                    </span>
                ),
            }),
            columnHelper.accessor('image', {
                id: 'image',
                header: () => 'Image',
                cell: (info) => {
                    const src = info.getValue();
                    if (!src) {
                        return (
                            <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                N/A
                            </div>
                        );
                    }
                    return (
                        <img
                            src={src}
                            alt={info.row.original?.name || 'category'}
                            className="w-12 h-12 rounded object-cover border border-gray-200"
                        />
                    );
                },
                enableSorting: false,
            }),
            columnHelper.accessor('name', {
                id: 'name',
                header: () => 'Name',
                cell: (info) => (
                    <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937] font-medium">
                        {info.getValue()}
                    </span>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('icon', {
                id: 'icon',
                header: () => 'Icon',
                cell: (info) => (
                    <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                        {info.getValue() || '-'}
                    </span>
                ),
            }),
            columnHelper.accessor('status', {
                id: 'status',
                header: () => 'Status',
                cell: (info) => {
                    const status = info.getValue();
                    const isActive = status === true || status === 'active';
                    return (
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-[0.875rem] font-medium text-white ${
                                isActive ? 'bg-[#16A34A]' : 'bg-[#EF4444]'
                            }`}
                        >
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    );
                },
                enableSorting: true,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => 'Actions',
                cell: (info) => {
                    const category = info.row.original;
                    return (
                        <div className="flex items-center gap-1">
                            <SquarePen
                                size={16}
                                className="cursor-pointer"
                                onClick={() => router.push(`/product-management/categories/edit/${category?.id}`)}
                            />
                        </div>
                    );
                },
            }),
        ],
        []
    );

    return (
        <CardLayout
            title="Category List"
            titleIcon={List}
            buttonText="Add Category"
            buttonPermission="create_category"
            buttonIcon={Plus}
            buttonHref="/product-management/categories/create"
        >
            {isLoading ? (
                <TableSkeleton rowLength={10} columnLength={columns?.length || 5} />
            ) : (
                <ReactTable
                    columns={columns}
                    dataSource={categoryData?.dataSource || []}
                    totalRecords={categoryData?.totalRecords}
                    pageAndLimit={pageAndLimit}
                    showPageSizeDropdown={(categoryData?.totalRecords || 0) > pageAndLimit.limit}
                    paginationOn={categoryData?.paginationOn}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onPageLimitChange={({ page, limit }) => {
                        setPageAndLimit({ page, limit });
                    }}
                />
            )}
        </CardLayout>
    );
};

export default CategoryList;
