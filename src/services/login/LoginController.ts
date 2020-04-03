import {LoginRequest, LoginResponse, Profile, Session} from "../../models";
import * as config from "../../config/database.json";
import {Database} from "../../database";
import {Response} from "express";
import {v4 as uuid} from "uuid";
import sha256 from "sha256";
import {HTTP401Error, HTTP403Error, HTTP404Error} from "../../utils/httpErrors";

export const login = async (loginRequest: LoginRequest, res: Response) => {
    const profile = await Database.findOne(config.collections.profiles, {
        email: loginRequest.email.toLowerCase(),
        password: sha256(loginRequest.password)
    });

    if(!profile || !profile._id) {
        throw new HTTP401Error("User not authorized");
    }

    const previousSession = await Database.findOne(config.collections.sessions, {
        profile: profile._id
    });

    if(!previousSession) {
        const session: Session = {
            profile: profile._id,
            hash: uuid(),
            lastLogin: new Date()
        };
        const savedSession = await Database.save(config.collections.sessions, session);
        if(savedSession && savedSession.insertedCount > 0){
            return produceResult(profile, session);
        }else{
            throw new HTTP404Error("Session not registered");
        }
    }else{
        const newSession: Partial<Session> = {
            hash: uuid(),
            lastLogin: new Date()
        };
        const updatedSession = await Database.update(config.collections.sessions, {
            profile: profile._id
        }, newSession);

        if(updatedSession.modifiedCount > 0){
            return produceResult(profile, newSession);
        }else{
            throw new HTTP404Error("Session not registered");
        }
    }
};

const produceResult = (profile: Profile, session: Partial<Session>): LoginResponse => (
    {
        email: profile.email,
        hash: session.hash ? session.hash : "",
        loggedAt: session.lastLogin ? session.lastLogin : new Date()
    }
);