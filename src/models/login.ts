export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse{
    email: string;
    hash: string;
    loggedAt: Date;
}

export interface Session {
    _id?: string;
    hash: string;
    profile: string;
    lastLogin: Date;
}