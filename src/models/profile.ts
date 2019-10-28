export const enum Genre {
    MALE="M",
    FEMALE="F",
    BOTH="B"
}
export interface Profile {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    description?: string;
    age: number;
    socialNetworks: SocialNetwork[];
    premium: boolean;
    distance?: number;
    latitude?: number; //Real or fake based on the preferences
    longitude?: number; //Real or fake based on the preferences
    location?: Location;
    genre: Genre;
    preferences: Preferences;
    deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    devices: Device[];
}

export interface Location {
    type: string,
    coordinates: number[];
    lastUpdate: Date
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
    genre: Genre;
    minimumAge: number;
    maximumAge: number;
    distance: number;
    showRealLocation: boolean;
}

export interface Device{
    uuid: string;
    locale: string;
    os: string;
    version: string;
    deviceType: string;
}

export interface UpdateLocationRequest extends Device {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    accuracy?: number;
}