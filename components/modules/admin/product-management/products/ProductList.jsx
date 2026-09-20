"use client";

import CardLayout from '@/components/common/CardLayout';
import { useEffect, useMemo, useState } from 'react';
import { Plus, List, SquarePen } from 'lucide-react';
import { useLazyGetProductListQuery } from '@/store/admin/product';
import { useGetCategoryListQuery } from '@/store/admin/category';
import ReactTable from '@/components/common/ReactTable/ReactTable';
import { createColumnHelper } from '@tanstack/react-table';
import TableSkeleton from '@/components/common/ReactTable/TableSkeleton';
import { useRouter } from 'next/navigation';

const columnHelper = createColumnHelper();

const ProductList = () => {
    const router = useRouter();
    const [pageAndLimit, setPageAndLimit] = useState({ page: 1, limit: 10 });
    const [searchQuery, setSearchQuery] = useState('');

    const [triggerList, { data: productData, isLoading }] = useLazyGetProductListQuery();
    const { data: categoryData } = useGetCategoryListQuery();

    useEffect(() => {
        triggerList({
            page: pageAndLimit.page,
            limit: pageAndLimit.limit,
        });
    }, [pageAndLimit]);

    const categoryMap = useMemo(() => {
        const map = {};
        (categoryData?.dataSource || []).forEach((cat) => {
            if (cat?.id !== undefined) map[cat.id] = cat?.name;
        });
        return map;
    }, [categoryData]);

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
                    if (!src || src === 'string') {
                        return (
                            <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                N/A
                            </div>
                        );
                    }
                    return (
                        <img
                            src={src}
                            alt={info.row.original?.name || 'product'}
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
            columnHelper.accessor('categoryId', {
                id: 'categoryId',
                header: () => 'Category',
                cell: (info) => {
                    const catId = info.getValue();
                    return (
                        <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                            {categoryMap[catId] || catId || '-'}
                        </span>
                    );
                },
                enableSorting: false,
            }),
            columnHelper.accessor('price', {
                id: 'price',
                header: () => 'Price',
                cell: (info) => {
                    const price = info.getValue();
                    return (
                        <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                            {price !== undefined && price !== null ? `৳ ${Number(price).toFixed(2)}` : '-'}
                        </span>
                    );
                },
                enableSorting: true,
            }),
            columnHelper.accessor('quantity', {
                id: 'quantity',
                header: () => 'Quantity',
                cell: (info) => (
                    <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                        {info.getValue() ?? 0}
                    </span>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('weight', {
                id: 'weight',
                header: () => 'Weight',
                cell: (info) => {
                    const row = info.row.original;
                    return (
                        <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                            {row?.weight ?? '-'} {row?.weight_type || ''}
                        </span>
                    );
                },
                enableSorting: false,
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
                    const product = info.row.original;
                    return (
                        <div className="flex items-center gap-1">
                            <SquarePen
                                size={16}
                                className="cursor-pointer"
                                onClick={() => router.push(`/product-management/products/edit/${product?.id}`)}
                            />
                        </div>
                    );
                },
            }),
        ],
        [categoryMap]
    );

    return (
        <CardLayout
            title="Product List"
            titleIcon={List}
            buttonText="Add Product"
            // buttonPermission="create_product"
            buttonIcon={Plus}
            buttonHref="/product-management/products/create"
        >
            {isLoading ? (
                <TableSkeleton rowLength={10} columnLength={columns?.length || 8} />
            ) : (
                <ReactTable
                    columns={columns}
                    dataSource={productData?.dataSource || []}
                    totalRecords={productData?.totalRecords}
                    pageAndLimit={pageAndLimit}
                    showPageSizeDropdown={(productData?.totalRecords || 0) > pageAndLimit.limit}
                    paginationOn={productData?.paginationOn}
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

export default ProductList;
