type AuthPayload = {
    accessToken: string,
    role?: string,
    displayName?: string,
    email?: string,
    uid?: number,
}

export default AuthPayload;