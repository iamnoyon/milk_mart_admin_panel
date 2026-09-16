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
import FormFileUpload from '@/components/Forms/FormFileUpload';
import FormRadioGroup from '@/components/Forms/FormRadioGroup';

const CategoryCreate = () => {
    const router = useRouter();
    const { errorToaster, successToaster } = useToaster();
    const [Create, {isLoading}] = useCreateCategoryMutation();

    const methods = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            icon: '',
            image: ''
        },
    });

    const onSubmit = (data) => {
        const payload = {
            name: data.name,
            icon: data.icon,
            image: data.image.url
        }
        console.log(payload)
        Create(payload)
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
                        placeholder='Enter category name'
                        required
                    />
                    <FormInput
                        name="icon"
                        label="Category Icon"
                        placeholder='Enter icon name'
                        required
                    />
                    <FormFileUpload
                        name='image'
                        label='Category Image'
                    />
                    {/* <FormRadioGroup
                    label='Status'
                    name='status'
                    /> */}
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
                        disabled={isLoading}
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
