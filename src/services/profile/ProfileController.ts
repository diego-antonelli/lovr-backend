import { Request } from "express";
import * as config from "../../config/database.json";
import {Database} from "../../database";
import {HTTP401Error} from "../../utils/httpErrors";
import {Genre, Profile} from "../../models";

const METERS_PER_KM = 1000;
// const METERS_PER_MILE = 1609.34;
const errors = [ -0.008, -0.007, -0.006, -0.005, -0.004, -0.003, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008];

const getError = () => {
    const index = Math.floor(Math.random() * 12);
    return errors[index];
};

export const findProfiles = async (req: Request) => {
    const currentSession = await Database.findOne(config.collections.sessions, {hash: req.header("lovr-api-key")});
    if(!currentSession || !currentSession._id){
        throw new HTTP401Error("Authorization required");
    }
    const currentProfile: Profile = await Database.findOne(config.collections.profiles, {_id: currentSession.profile});
    if(!currentProfile || !currentProfile._id){
        throw new HTTP401Error("Authorization required");
    }
    if(!currentProfile.preferences || !currentProfile.preferences.genre || !currentProfile.preferences.distance || !currentProfile.location){
        return [];
    }

    let filterGenre;
    if(currentProfile.preferences.genre == Genre.BOTH){
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
    }else{
        filterGenre = {
            "genre": currentProfile.preferences.genre
        }
    }

    const results = await Database.findMany(config.collections.profiles, {
        "_id": {
            $ne: currentProfile._id
        },
        ...filterGenre,
        "age": {
            $gte: currentProfile.preferences.minimumAge,
            $lte: currentProfile.preferences.maximumAge
        },
        "preferences.minimumAge": {
            $lte: currentProfile.age
        },
        "preferences.maximumAge": {
            $gte: currentProfile.age
        },
        $or: [
            {"preferences.genre": Genre.BOTH},
            {"preferences.genre": currentProfile.genre}
        ],
        "location": {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: currentProfile.location.coordinates
                },
                $maxDistance: currentProfile.preferences.distance * METERS_PER_KM
            }
        }
    });

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