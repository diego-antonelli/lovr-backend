import { Request } from "express";
import * as config from "../../config/database.json";
import {Database} from "../../database";
import {HTTP400Error, HTTP401Error, HTTP404Error} from "../../utils/httpErrors";
import {UpdateLocationRequest, Genre, Profile, Preferences} from "../../models";

const METERS_PER_KM = 1000;
// const METERS_PER_MILE = 1609.34;
const errors = [ -0.008, -0.007, -0.006, -0.005, -0.004, -0.003, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008];

const getError = () => {
    const index = Math.floor(Math.random() * 12);
    return errors[index];
};

export const findProfiles = async (req: Request) => {
    const currentProfile = await extractProfile(req);

    if(!currentProfile.preferences || !currentProfile.preferences.genre || !currentProfile.preferences.distance || !currentProfile.location){
        return [];
    }

    const results = await Database.findAggregate(config.collections.profiles, generateBodyAggregate(currentProfile));

    if(results.length === 0) return [];

    return results.map((profile: Profile) => {
        if(profile.preferences && !profile.preferences.showRealLocation){
            profile.latitude = profile.location!.coordinates[0]+getError();
            profile.longitude = profile.location!.coordinates[1] + getError();
        }
        const {_id, location, preferences, ...otherProps} = profile;
        return otherProps;
    });
};

export const updateLocation = async (req: Request): Promise<Profile> => {
    const currentProfile = await extractProfile(req);
    const body = req.body as UpdateLocationRequest;
    const updatedProfile = await Database.updateCustom(config.collections.profiles, {
        "_id": currentProfile._id
    }, {
        $set: {
            "location.coordinates": [Number(body.latitude), Number(body.longitude)],
            "devices.$[filter]": {
                "uuid": body.uuid,
                "deviceType": body.deviceType,
                "locale": body.locale,
                "os": body.os,
                "version": body.version
            }
        }
    },{arrayFilters:[{"filter.uuid": body.uuid}]});
    // Add the new array if it doesn't exists
    await Database.updateCustom(config.collections.profiles, {
        "_id": currentProfile._id
    }, {
        $addToSet: {
            "devices": {
                "uuid": body.uuid,
                "deviceType": body.deviceType,
                "locale": body.locale,
                "os": body.os,
                "version": body.version
            }
        }
    });
    if(!updatedProfile || updatedProfile.matchedCount === 0){
        throw new HTTP400Error();
    }
    return await Database.findOne(config.collections.profiles, {"_id": currentProfile._id});
};

export const updatePreferences = async (req: Request): Promise<Profile> => {
    const currentProfile = await extractProfile(req);
    const body = req.body as Preferences;
    const updatedProfile = await Database.update(config.collections.profiles, {
        "_id": currentProfile._id
    }, {"preferences": body});
    if(!updatedProfile || updatedProfile.matchedCount === 0){
        throw new HTTP400Error();
    }
    return {
        ...currentProfile,
        preferences: body
    } as Profile;
};

const extractProfile = async (req: Request): Promise<Profile> => {
    const currentSession = await Database.findOne(config.collections.sessions, {hash: req.header("lovr-api-key")});
    if(!currentSession || !currentSession._id){
        throw new HTTP401Error("Authorization required");
    }
    const currentProfile = await Database.findOne(config.collections.profiles, {_id: currentSession.profile});
    if(!currentProfile || !currentProfile._id){
        throw new HTTP401Error("Authorization required");
    }

    return currentProfile;
};
const generateBodyAggregate = (profile: Profile) => {
    let filterGenre;
    if (profile.preferences.genre == Genre.BOTH) {
        filterGenre = {
            $or: [
                {
                    "genre": Genre.MALE
                },
                {
                    "genre": Genre.FEMALE
                }
            ]
        }
    } else {
        filterGenre = {
            "genre": profile.preferences.genre
        }
    }
    return {
        $geoNear: {
            near: {
                type: "Point",
                coordinates: profile.location!.coordinates
            },
            distanceField: "distance",
            maxDistance: profile.preferences.distance * METERS_PER_KM,
            key: "location",
            spherical: true,
            query: {
                "_id": {
                    $ne: profile._id
                },
                ...filterGenre,
                "age": {
                    $gte: profile.preferences.minimumAge,
                    $lte: profile.preferences.maximumAge
                },
                "preferences.minimumAge": {
                    $lte: profile.age
                },
                "preferences.maximumAge": {
                    $gte: profile.age
                },
                $or: [
                    {"preferences.genre": Genre.BOTH},
                    {"preferences.genre": profile.genre}
                ]
            }
        }
    }
};