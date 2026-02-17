import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import sidebarReducer from '@/features/sidebar/sidebarSlice';
import usersReducer from '@/features/users/userSlice';
import appReducer from '@/features/app/appSlice';
import toastReducer from '@/features/toast/toastSlice';
import rolesReducer from '@/features/roles/roleSlice';
import loaderReducer from '@/features/loader/loaderSlice';
import productsReducer from '@/features/products/productSlice';
import uploadReducer from '@/features/upload/uploadSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    sidebar: sidebarReducer,
    users: usersReducer,
    toast: toastReducer,
    roles: rolesReducer,
    loader: loaderReducer,
    products: productsReducer,
    upload: uploadReducer
  },
});

export default store;