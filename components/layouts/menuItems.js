// components/layout/menuItems.js

import {
  LayoutDashboard,
  Users,
  FolderTree,
  Package,
  Truck,
} from "lucide-react";


export const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    activePath: ["/dashboard"],
    // requiredPermissions: ["dashboard:read"]
  },
  {
    name: "Assign Orders",
    icon: Truck,
    path: "/order-assignment",
    activePath: ["/order-assignment"],
  },
  {
    name: "Users",
    icon: Users,
    path: "/user-management/users",
    activePath: ["/user-management/users"],
    // requiredPermissions: ["user:read"],
  },
  {
    name: "Product Management",
    icon: FolderTree,
    path: '#',
    children: [
      {
        name: "Category",
        icon: FolderTree,
        path: "/product-management/categories",
        activePath: ["/product-management/categories"],
        requiredPermissions: ["read_category"],
      },
      {
        name: "Products",
        icon: Package,
        path: "/product-management/products",
        activePath: ["/product-management/products"],
        // requiredPermissions: ["read_product"],
      },
    ]
  }
];




export const breadcrumbData = [
  {
    route: '/order-assignment',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Assign Orders', url: '#' },
    ]
  },
  {
    route: '/user-management/users',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'User List', url: '#' },
    ]
  },
  {
    route: '/user-management/users/create',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'User List', url: '/user-management/users' },
      { label: 'Create', url: '#' },
    ]
  },
  {
    route: '/user-management/users/edit/[id]',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'User List', url: '/user-management/users' },
      { label: 'Edit', url: '#' },
    ]
  },
  {
    route: '/product-management/categories',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Category List', url: '#' },
    ]
  },
  {
    route: '/product-management/categories/create',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Category List', url: '/product-management/categories' },
      { label: 'Create', url: '#' },
    ]
  },
  {
    route: '/product-management/categories/edit/[id]',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Category List', url: '/product-management/categories' },
      { label: 'Edit', url: '#' },
    ]
  },
  {
    route: '/product-management/products',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Product List', url: '#' },
    ]
  },
  {
    route: '/product-management/products/create',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Product List', url: '/product-management/products' },
      { label: 'Create', url: '#' },
    ]
  },
  {
    route: '/product-management/products/edit/[id]',
    items: [
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Product List', url: '/product-management/products' },
      { label: 'Edit', url: '#' },
    ]
  }
]
