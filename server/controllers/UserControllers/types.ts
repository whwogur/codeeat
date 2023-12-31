export type Token = string

export interface IUserInfo {
    userId: string
    hashedPassword: string
    username: string
    userProfile: IUserProfile
    refreshToken?: Token | null
    createdAt: Date | null
}

export interface IUserProfile {
    [key: string]: any
    character: string
    userLevel: number
    currentExp: number
    requiredExp: number
    grade?: string
    school?: string
    profileMessage?: string
}

//   lastUpdated?: Date | null