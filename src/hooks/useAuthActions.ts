import { authorizationTwitter } from "@/api/auth";
import { useAuth } from "@/context/AuthContect";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { MainNetworkAccess } from "@/access";
import { toastError, toastSuccess } from "@/utils/toast";

export const useAuthActions = () => {
    const router = useRouter();
    const { resetUser } = useAuth();

    const handleLoginTwitter = useCallback(async () => {
        try {
            const url = await authorizationTwitter();
            if (url) {
                window.location.replace(url);
            }
        } catch (error) {
            console.error("Login failed:", error);
            toastError("Login failed. Please try again.");
        }
    }, []);

    const handleLogout = useCallback(() => {
        try {
            signOut({
                redirect: false,
            });
            // Clear authorization header
            MainNetworkAccess.defaultHeaders = {};
            resetUser();

            localStorage.removeItem("userTwitter");
            router.push("/");
            toastSuccess("Logged out successfully!");
        } catch (error) {
            console.error("Logout failed:", error);
            toastError("Logout failed. Please try again.");
        }
    }, [resetUser, router]);

    return {
        handleLoginTwitter,
        handleLogout,
    };
}; 