"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setUser, setToken } from "@/store/user";
import { useProfileQuery } from "@/store/auth";
import { performLogout } from "@/utils/logout";

export default function SessionSync() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();

    const token = session?.user?.backendToken;

    useEffect(() => {
        if (status === "authenticated" && token) {
            dispatch(setToken(token));
        }
    }, [status, token, dispatch]);

    const {
        data: profileData,
        isError,
    } = useProfileQuery(token, {
        skip: status !== "authenticated" || !token,
    });

    useEffect(() => {
        if (profileData?.data) {
            dispatch(setUser(profileData.data));

            if (token) {
                dispatch(setToken(token));
            }
        }
    }, [profileData, token, dispatch]);

    useEffect(() => {
        if (isError && token) {
            performLogout();
        }
    }, [isError, token]);

    return null;
}
