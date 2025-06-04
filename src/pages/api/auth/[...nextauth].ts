/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { MainNetworkAccess } from "@/access";
import { ExpiresType } from "@/constants";

interface TokenType {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires?: number;
    error?: string;
}

async function refreshAccessToken(token: TokenType) {
    const { refreshToken } = token;
    if (!refreshToken) throw Error("invalid refresh token !!");

    try {
        const { data: access_token } = await MainNetworkAccess.Post("/refresh-token", {
            data: {
                refresh_token: refreshToken,
            },
        });

        MainNetworkAccess.defaultHeaders = {
            Authorization: `Bearer ${access_token}`,
        };

        return {
            ...token,
            accessToken: access_token,
            accessTokenExpires: Date.now() + 0.1 * 1000, // TODO: test
            refreshToken,
        };
    } catch (error) {
        console.log(error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}
export default NextAuth({
    providers: [
        CredentialsProvider({
            id: "credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
                user_name: { label: "user_name", type: "text" },
                avatar: { label: "avatar", type: "text" },
                twitter_id: { label: "twitter_id", type: "text" },
                country_code: { label: "country_code", type: "text" },
            },
            authorize: async (credentials) => {
                if (!credentials) return null;

                const { email, user_name, avatar, twitter_id, country_code } = credentials;

                try {
                    const { data } = await MainNetworkAccess.Post("login-by-twitter", {
                        data: {
                            email,
                            user_name,
                            avatar,
                            twitter_id,
                            country_code,
                        },
                    });

                    MainNetworkAccess.defaultHeaders = {
                        Authorization: `Bearer ${data.accessToken}`,
                    };

                    return data;
                } catch (error) {
                    console.log(error);
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: any): Promise<any> {
            if (account?.provider === "twitter") {
                try {
                    const { data } = await MainNetworkAccess.Post("/login-by-twitter", {
                        data: {
                            email: "",
                            user_name: profile?.data?.name,
                            avatar: profile?.data?.profile_image_url,
                            twitter_id: profile?.data?.id,
                        },
                    });

                    user.accessToken = data.accessToken;
                    user.refreshToken = data.refreshToken;

                    return user;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }
            return { ...user };
        },
        session: async ({ session, token }: any) => {
            session.accessToken = token?.accessToken;
            session.refreshToken = token?.refreshToken;
            return session;
        },
        jwt: async ({ user, token }: { user: any; token: any }) => {
            if (user) {
                token.accessToken = user?.accessToken;
                token.refreshToken = user?.refreshToken;
            }
            const data: ExpiresType = jwtDecode(token?.accessToken);
            if (Date.now() < data.exp * 1000) {
                return token;
            }

            const res: any = await refreshAccessToken(token);
            if (res) {
                token.accessToken = res.accessToken;
                token.refreshToken = res.refreshToken;
                return token;
            }
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.JWT_SECRET,
});
