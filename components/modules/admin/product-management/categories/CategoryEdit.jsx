"use client";

import CardLayout from '@/components/common/CardLayout';
import React, { useEffect } from 'react';
import { FolderTree } from "lucide-react";
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryUpdateSchema } from './schema';
import Formwrapper from '@/components/Forms/Formwrapper';
import FormInput from '@/components/Forms/FormInput';
import FormTextarea from '@/components/Forms/FormTextarea';
import { useForm } from 'react-hook-form';
import {
    useGetCategoryInfoByIdQuery,
    useUpdateCategoryInfoMutation
} from '@/store/admin/category';
import { useParams, useRouter } from 'next/navigation';
import useToaster from '@/components/hooks/useToaster';
import Swal from "sweetalert2";

const CategoryEdit = () => {
    const id = useParams()?.id;
    const router = useRouter();
    const { errorToaster, successToaster } = useToaster();
    const [Update] = useUpdateCategoryInfoMutation();
    const { data: categoryInfo } = useGetCategoryInfoByIdQuery({ id }, { skip: !id });

    const methods = useForm({
        resolver: zodResolver(categoryUpdateSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    useEffect(() => {
        if (categoryInfo?.success) {
            methods.reset({
                name: categoryInfo?.data?.name,
                description: categoryInfo?.data?.description || '',
            });
        }
    }, [categoryInfo]);

    const onSubmit = async (data) => {
        const result = await Swal.fire({
            title: "Confirm Update",
            text: "Are you sure you want to update this category?",
            icon: "question",
            width: "350px",
            padding: "1.25rem",
            showCancelButton: true,
            confirmButtonColor: "#043570",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update",
            cancelButtonText: "Cancel",
            didOpen: (popup) => {
                const icon = popup.querySelector(".swal2-icon");
                if (icon) icon.style.transform = "scale(0.7)";
            },
        });
        if (!result.isConfirmed) return;

        Update({ id, data })
            .unwrap()
            .then((res) => {
                if (res?.success || res?.status_code === 200) {
                    successToaster("Category updated successfully!");
                    router.push("/product-management/categories");
                }
            })
            .catch((err) => {
                errorToaster(err?.data?.message || "Failed to update category.");
                console.log(err);
            });
    };

    return (
        <CardLayout
            title="Edit Category"
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
                        Update
                    </button>
                </div>
            </Formwrapper>
        </CardLayout>
    );
};

export default CategoryEdit;
