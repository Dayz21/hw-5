export type UserResponseType = {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
};

export type UserType = {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export const toUserType = (response: UserResponseType): UserType => ({
    id: response.id,
    username: response.username,
    email: response.email,
    provider: response.provider,
    confirmed: response.confirmed,
    blocked: response.blocked,
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
});
