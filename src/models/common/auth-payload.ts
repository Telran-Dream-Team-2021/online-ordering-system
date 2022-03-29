type AuthPayload = {
    accessToken: string,
    roles: string[],
    displayName?: string,
    email?: string,
    uid?: number,
}

export default AuthPayload;