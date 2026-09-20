"use client";

import CardLayout from '@/components/common/CardLayout';
import React, { useEffect } from 'react';
import { Package } from "lucide-react";
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, WEIGHT_TYPES } from './schema';
import Formwrapper from '@/components/Forms/Formwrapper';
import FormInput from '@/components/Forms/FormInput';
import FormTextarea from '@/components/Forms/FormTextarea';
import FormSelect from '@/components/Forms/FormSelect';
import FormFileUpload from '@/components/Forms/FormFileUpload';
import { useForm } from 'react-hook-form';
import {
    useCreateProductMutation,
} from '@/store/admin/product';
import { useGetCategoryListQuery } from '@/store/admin/category';
import { useRouter } from 'next/navigation';
import useToaster from '@/components/hooks/useToaster';

const ProductCreate = () => {
    const router = useRouter();
    const { errorToaster, successToaster } = useToaster();
    const [Create, { isLoading }] = useCreateProductMutation();
    const { data: categoryData } = useGetCategoryListQuery();

    const categories = categoryData?.dataSource || [];

    const methods = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            categoryId: '',
            name: '',
            description: '',
            weight: '',
            weight_type: '',
            quantity: '',
            price: '',
            image: null,
        },
    });

    useEffect(() => {
        if (categoryData?.success && categories.length === 0) {
            // graceful: nothing to do
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryData]);

    const onSubmit = (data) => {
        const payload = {
            categoryId: Number(data.categoryId),
            name: data.name,
            description: data.description || '',
            weight: Number(data.weight),
            weight_type: data.weight_type,
            quantity: Number(data.quantity),
            price: Number(data.price),
            image: data?.image?.url || data?.image || '',
        };

        Create(payload)
            .unwrap()
            .then((res) => {
                if (res?.success || res?.status_code === 201) {
                    successToaster(res?.message || "Product created successfully!");
                    router.push("/product-management/products");
                } else {
                    successToaster("Product created successfully!");
                    router.push("/product-management/products");
                }
            })
            .catch((err) => {
                errorToaster(err?.data?.message || "Failed to create product.");
                console.log(err);
            });
    };

    return (
        <CardLayout
            title="Add Product"
            titleIcon={Package}
        >
            <Formwrapper methods={methods} onSubmit={onSubmit}>
                <div className='grid lg:grid-cols-2 gap-5'>
                    <FormSelect
                        name="categoryId"
                        label="Category"
                        options={categories}
                        labelKey="name"
                        valueKey="id"
                        placeholder="Select a category"
                        required
                    />
                    <FormInput
                        name="name"
                        label="Product Name"
                        placeholder='Enter product name'
                        required
                    />
                    <FormInput
                        name="weight"
                        label="Weight"
                        type="number"
                        placeholder='e.g. 500'
                        required
                    />
                    <FormSelect
                        name="weight_type"
                        label="Weight Type"
                        options={WEIGHT_TYPES}
                        labelKey="label"
                        valueKey="value"
                        placeholder="Select weight type"
                        required
                    />
                    <FormInput
                        name="quantity"
                        label="Quantity"
                        type="number"
                        placeholder='e.g. 10'
                        required
                    />
                    <FormInput
                        name="price"
                        label="Price"
                        type="number"
                        placeholder='e.g. 200'
                        required
                    />
                </div>
                <div className='mt-5'>
                    <FormFileUpload
                        name='image'
                        label='Product Image'
                    />
                </div>
                <div className='mt-5'>
                    <FormTextarea
                        name="description"
                        label="Description"
                        placeholder='Enter product description'
                        rows={4}
                    />
                </div>
                <div className='flex items-center justify-center gap-10 mt-20'>
                    <button
                        type='button'
                        onClick={() => router.push("/product-management/products")}
                        className='w-40 hover:cursor-pointer hover:bg-[#0A4D99] rounded font-semibold py-2 border text-[#0A4D99] hover:text-white border-[#0A4D99]'
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className='w-40 hover:cursor-pointer hover:bg-[#053872] rounded font-semibold py-2 bg-[#0A4D99] text-white'
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </Formwrapper>
        </CardLayout>
    );
};

export default ProductCreate;
