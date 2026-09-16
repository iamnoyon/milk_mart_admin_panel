import Loading from '@/components/common/Loading';
import CategoryEdit from '@/components/modules/admin/product-management/categories/CategoryEdit';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CategoryEdit />
    </Suspense>
  );
};

export default page;
