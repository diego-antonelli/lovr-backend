export const enum Genre {
    MALE,
    FEMALE,
    BOTH
}
export interface Profile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    description?: string;
    age: number;
    socialNetworks: SocialNetwork[];
    premium: boolean;
    distance: number;
    latitude: number; //Real or fake based on the preferences
    longitude: number; //Real or fake based on the preferences
    genre: Genre;
    preferences: Preferences;
    deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    devices: Device[];
}

export interface SocialNetwork{
    id: string;
    type: SocialNetworkType;
    user: string;
}

export const enum SocialNetworkType {
    FACEBOOK,
    TWITTER,
    INSTAGRAM,
    FLICKR,
    YOUTUBE,
    SNAPCHAT,
    GOOGLE_PLUS,
    PINTEREST,
    REDDIT,
    TUMBLR,
    LINKEDIN
}

export interface Preferences{
    id: string;
    genre: Genre;
    minimumAge: number;
    maximumAge: number;
    distance: number;
    showRealLocation: boolean;
}

export interface Device{
    id: string;
    uuid: string;
    locale: string;
    os: string;
    version: string;
    deviceType: string;
}