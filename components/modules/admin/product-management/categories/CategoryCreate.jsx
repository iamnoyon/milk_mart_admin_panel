"use client";

import CardLayout from '@/components/common/CardLayout';
import React from 'react';
import { FolderTree } from "lucide-react";
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from './schema';
import Formwrapper from '@/components/Forms/Formwrapper';
import FormInput from '@/components/Forms/FormInput';
import FormTextarea from '@/components/Forms/FormTextarea';
import { useForm } from 'react-hook-form';
import { useCreateCategoryMutation } from '@/store/admin/category';
import { useRouter } from 'next/navigation';
import useToaster from '@/components/hooks/useToaster';

const CategoryCreate = () => {
    const router = useRouter();
    const { errorToaster, successToaster } = useToaster();
    const [Create] = useCreateCategoryMutation();

    const methods = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit = (data) => {
        Create(data)
            .unwrap()
            .then((res) => {
                if (res?.success || res?.status_code === 201) {
                    successToaster("Category created successfully!");
                    router.push("/product-management/categories");
                }
            })
            .catch((err) => {
                errorToaster(err?.data?.message || "Failed to create category.");
                console.log(err);
            });
    };

    return (
        <CardLayout
            title="Add Category"
            titleIcon={FolderTree}
        >
            <Formwrapper methods={methods} onSubmit={onSubmit}>
                <div className='grid lg:grid-cols-2 gap-5'>
                    <FormInput
                        name="name"
                        label="Category Name"
                        placeholder='Electronics'
                        required
                    />
                    <div className='lg:col-span-2'>
                        <FormTextarea
                            name="description"
                            label="Description"
                            placeholder='Short description about this category'
                            rows={4}
                        />
                    </div>
                </div>
                <div className='flex items-center justify-center gap-10 mt-20'>
                    <button
                        type='button'
                        onClick={() => router.push("/product-management/categories")}
                        className='w-40 hover:cursor-pointer hover:bg-[#0A4D99] rounded font-semibold py-2 border text-[#0A4D99] hover:text-white border-[#0A4D99]'
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className='w-40 hover:cursor-pointer hover:bg-[#053872] rounded font-semibold py-2 bg-[#0A4D99] text-white'
                    >
                        Save
                    </button>
                </div>
            </Formwrapper>
        </CardLayout>
    );
};

export default CategoryCreate;
