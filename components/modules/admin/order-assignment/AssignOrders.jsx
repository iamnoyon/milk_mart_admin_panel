"use client";

import CardLayout from '@/components/common/CardLayout';
import { useEffect, useMemo, useState } from 'react';
import { Truck, List } from 'lucide-react';
import ReactTable from '@/components/common/ReactTable/ReactTable';
import { createColumnHelper } from '@tanstack/react-table';
import TableSkeleton from '@/components/common/ReactTable/TableSkeleton';
import useToaster from '@/components/hooks/useToaster';
import {
    useGetDeliverymanListQuery,
    useLazyGetPendingOrdersQuery,
    useAssignOrdersToDeliverymanMutation,
} from '@/store/admin/order-assignment';

const columnHelper = createColumnHelper();

const AssignOrders = () => {
    const { successToaster, errorToaster } = useToaster();

    const [selectedDeliveryman, setSelectedDeliveryman] = useState(null);
    const [pageAndLimit, setPageAndLimit] = useState({ page: 1, limit: 10 });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [deliverymanSearch, setDeliverymanSearch] = useState('');

    const { data: deliverymenData, isLoading: deliverymenLoading } =
        useGetDeliverymanListQuery();

    const [
        triggerPendingOrders,
        { data: pendingOrdersData, isLoading: pendingOrdersLoading },
    ] = useLazyGetPendingOrdersQuery();

    const [assignOrders, { isLoading: assigning }] =
        useAssignOrdersToDeliverymanMutation();

    useEffect(() => {
        triggerPendingOrders({
            page: pageAndLimit.page,
            limit: pageAndLimit.limit,
            status: 'pending'
        });
    }, [pageAndLimit]);

    const deliverymen = useMemo(() => {
        const list = deliverymenData?.dataSource || [];
        if (!deliverymanSearch) return list;
        const q = deliverymanSearch.toLowerCase();
        return list.filter(
            (d) =>
                (d?.name || '').toLowerCase().includes(q) ||
                (d?.phone || '').toLowerCase().includes(q)
        );
    }, [deliverymenData, deliverymanSearch]);

    const toggleOrderSelection = (orderId) => {
        if (!orderId) return;
        setSelectedOrderIds((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId]
        );
    };

    const toggleSelectAllOnPage = () => {
        const rows = pendingOrdersData?.dataSource || [];
        const pageIds = rows.map((r) => r?.id).filter(Boolean);
        const allSelected = pageIds.every((id) =>
            selectedOrderIds.includes(id)
        );
        if (allSelected) {
            setSelectedOrderIds((prev) =>
                prev.filter((id) => !pageIds.includes(id))
            );
        } else {
            setSelectedOrderIds((prev) => {
                const set = new Set(prev);
                pageIds.forEach((id) => set.add(id));
                return Array.from(set);
            });
        }
    };

    const handleAssign = async () => {
        if (!selectedDeliveryman) {
            errorToaster('Please select a deliveryman first.');
            return;
        }
        if (selectedOrderIds.length === 0) {
            errorToaster('Please select at least one order to assign.');
            return;
        }

        try {
            const res = await assignOrders({
                deliverymanId: selectedDeliveryman,
                orderIds: selectedOrderIds,
            }).unwrap();

            if (res?.success || res?.status_code === 200) {
                successToaster(
                    res?.message || 'Orders assigned successfully!'
                );
                setSelectedOrderIds([]);
                triggerPendingOrders({
                    page: pageAndLimit.page,
                    limit: pageAndLimit.limit,
                });
            } else {
                errorToaster(res?.message || 'Failed to assign orders.');
            }
        } catch (err) {
            errorToaster(err?.data?.message || 'Failed to assign orders.');
        }
    };

    const pageIds = useMemo(
        () =>
            (pendingOrdersData?.dataSource || [])
                .map((r) => r?.id)
                .filter(Boolean),
        [pendingOrdersData]
    );

    const allOnPageSelected =
        pageIds.length > 0 &&
        pageIds.every((id) => selectedOrderIds.includes(id));

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: 'select',
                header: () => (
                    <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleSelectAllOnPage}
                        disabled={pageIds.length === 0}
                        className="h-4 w-4 cursor-pointer rounded accent-[#0A4D99]"
                        aria-label="Select all on page"
                    />
                ),
                cell: (info) => {
                    const id = info.row.original?.id;
                    const checked = selectedOrderIds.includes(id);
                    return (
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleOrderSelection(id)}
                            className="h-4 w-4 cursor-pointer rounded accent-[#0A4D99]"
                            aria-label={`Select order ${id}`}
                        />
                    );
                },
                enableSorting: false,
            }),
            columnHelper.accessor('sl', {
                id: 'sl',
                header: () => 'SL No.',
                cell: (info) => (
                    <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                        {info.row.index + 1}
                    </span>
                ),
                enableSorting: false,
            }),
            columnHelper.accessor('order_number', {
                id: 'order_number',
                header: () => 'Order No.',
                cell: (info) => (
                    <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937] font-medium">
                        {info.getValue() ?? info.row.original?.id ?? '-'}
                    </span>
                ),
                enableSorting: true,
            }),
            columnHelper.accessor('user', {
                id: 'user',
                header: () => 'Customer',
                cell: (info) => (
                    <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                        {info.getValue()?.name ?? '-'}
                    </span>
                ),
                enableSorting: false,
            }),
            columnHelper.accessor('phone', {
                id: 'phone',
                header: () => 'Phone',
                cell: (info) => (
                    <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                        {info.row.original.user.phone ?? '-'}
                    </span>
                ),
                enableSorting: false,
            }),
            columnHelper.accessor('address', {
                id: 'address',
                header: () => 'Address / Avenue / Road',
                cell: (info) => (
                    <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                         {info.row.original.user.location.area ?? '-'} / {info.row.original.user.location.avenue ?? '-'} / {info.row.original.user.location.road ?? '-'}
                    </span>
                ),
                enableSorting: false,
            }),
            columnHelper.accessor('total_price', {
                id: 'total_price',
                header: () => 'Amount',
                cell: (info) => {
                    const amount = info.getValue();
                    return (
                        <span className="font-['DM_Sans',sans-serif] text-sm text-[#1f2937]">
                            {amount !== undefined && amount !== null
                                ? `৳ ${Number(amount).toFixed(2)}`
                                : '-'}
                        </span>
                    );
                },
                enableSorting: true,
            }),
            columnHelper.accessor('status', {
                id: 'status',
                header: () => 'Status',
                cell: (info) => {
                    const status = info.getValue() || 'pending';
                    const statusColor =
                        status === 'pending'
                            ? 'bg-amber-500'
                            : status === 'ready'
                            ? 'bg-blue-500'
                            : 'bg-gray-500';
                    return (
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-[0.875rem] font-medium text-white ${statusColor}`}
                        >
                            {status
                                ? status.charAt(0).toUpperCase() +
                                  status.slice(1)
                                : 'Pending'}
                        </span>
                    );
                },
                enableSorting: false,
            }),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedOrderIds, allOnPageSelected, pageIds]
    );

    const selectedDeliverymanName = useMemo(() => {
        const found = (deliverymenData?.dataSource || []).find(
            (d) => String(d?.id) === String(selectedDeliveryman)
        );
        return found?.name || '';
    }, [deliverymenData, selectedDeliveryman]);

    return (
        <div className="space-y-5">
            <CardLayout title="Assign Orders" titleIcon={Truck}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-800">
                            Select Deliveryman{' '}
                            <span className="text-red-700">*</span>
                        </label>
                        <select
                            value={selectedDeliveryman || ''}
                            onChange={(e) =>
                                setSelectedDeliveryman(
                                    e.target.value || null
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-300 focus:outline-none"
                            disabled={deliverymenLoading}
                        >
                            <option value="">
                                {deliverymenLoading
                                    ? 'Loading deliverymen...'
                                    : '-- Choose a deliveryman --'}
                            </option>
                            {deliverymen.map((d) => (
                                <option key={d?.id} value={d?.id}>
                                    {d?.name}
                                    {d?.phone ? ` (${d?.phone})` : ''}
                                </option>
                            ))}
                        </select>

                        <div className="relative mt-3">
                            <input
                                type="text"
                                value={deliverymanSearch}
                                onChange={(e) =>
                                    setDeliverymanSearch(e.target.value)
                                }
                                placeholder="Filter deliveryman list..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-300 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={handleAssign}
                            disabled={
                                !selectedDeliveryman ||
                                selectedOrderIds.length === 0 ||
                                assigning
                            }
                            className="w-full rounded-lg bg-[#0A4D99] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#053872] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {assigning
                                ? 'Assigning...'
                                : `Assign ${
                                      selectedOrderIds.length > 0
                                          ? `(${selectedOrderIds.length})`
                                          : ''
                                  }`}
                        </button>
                        {selectedDeliverymanName && (
                            <p className="text-xs text-gray-500">
                                Assigning to:{' '}
                                <span className="font-semibold text-gray-700">
                                    {selectedDeliverymanName}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </CardLayout>

            <CardLayout title="Pending Orders" titleIcon={List}>
                {pendingOrdersLoading ? (
                    <TableSkeleton
                        rowLength={10}
                        columnLength={columns?.length || 7}
                    />
                ) : (
                    <ReactTable
                        columns={columns}
                        dataSource={pendingOrdersData?.dataSource || []}
                        totalRecords={pendingOrdersData?.totalRecords}
                        pageAndLimit={pageAndLimit}
                        showPageSizeDropdown={
                            (pendingOrdersData?.totalRecords || 0) >
                            pageAndLimit.limit
                        }
                        paginationOn={pendingOrdersData?.paginationOn}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onPageLimitChange={({ page, limit }) => {
                            setPageAndLimit({ page, limit });
                            setSelectedOrderIds([]);
                        }}
                    />
                )}
                {!pendingOrdersLoading &&
                    (pendingOrdersData?.dataSource || []).length > 0 && (
                        <p className="mt-2 text-xs text-gray-500">
                            {selectedOrderIds.length} order(s) selected across
                            all pages
                        </p>
                    )}
            </CardLayout>
        </div>
    );
};

export default AssignOrders;