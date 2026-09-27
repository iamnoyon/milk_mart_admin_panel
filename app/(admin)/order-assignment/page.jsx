import AssignOrders from '@/components/modules/admin/order-assignment/AssignOrders';
import Loading from '@/components/common/Loading';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AssignOrders />
    </Suspense>
  );
};

export default page;