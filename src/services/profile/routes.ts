import {Request, Response} from "express";
import {checkHeader, checkLocationRequest, checkPreferencesRequest} from "../../middleware/checks";
import {findProfiles, updateLocation, updatePreferences} from "./ProfileController";

export default [
    {
        path: "/api/v1/profile/all",
        method: "get",
        handler: [
            checkHeader,
            async (req: Request, res: Response) => {
                const result = await findProfiles(req);
                res.status(200).send(result);
            }
        ]
    },
    {
        path: "/api/v1/profile/update-location",
        method: "post",
        handler: [
            checkHeader,
            checkLocationRequest,
            async (req: Request, res: Response) => {
                const result = await updateLocation(req);
                res.status(200).send(result);
            }
        ]
    },
    {
        path: "/api/v1/profile/update-preferences",
        method: "post",
        handler: [
            checkHeader,
            checkPreferencesRequest,
            async (req: Request, res: Response) => {
                const result = await updatePreferences(req);
                res.status(200).send(result);
            }
        ]
    }
];