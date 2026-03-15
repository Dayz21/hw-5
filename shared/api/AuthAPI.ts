import { API } from "./API";
import { STORAGE_KEYS } from "@/shared/config/config";
import { toUserType, type UserType } from "@/shared/store/models/User";

class AuthAPIClass {
    async login(identifier: string, password: string): Promise<void> {
        const response = await API.post(`/auth/local`, {
            identifier,
            password,
        });
        localStorage.setItem(STORAGE_KEYS.token, response.data.jwt);
    }

    async register({
        username,
        email,
        password,
    }: {
        username: string;
        email: string;
        password: string;
    }): Promise<void> {
        const response = await API.post(`/auth/local/register`, {
            username,
            email,
            password,
        });
        localStorage.setItem(STORAGE_KEYS.token, response.data.jwt);
    }

    async logout(): Promise<void> {
        localStorage.removeItem(STORAGE_KEYS.token);
    }

    async me(): Promise<UserType> {
        const response = await API.get(`/users/me`);
        return toUserType(response.data);
    }
}

export const AuthAPI = new AuthAPIClass();
