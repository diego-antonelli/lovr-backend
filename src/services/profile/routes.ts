import {Request, Response} from "express";
import {checkHeader} from "../../middleware/checks";
import {findProfiles} from "./ProfileController";

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
            async ({body}: Request, res: Response) => {
                //const result = await getPlacesByName(query.q);
                res.status(200).send({});
            }
        ]
    },
    {
        path: "/api/v1/profile/update-preferences",
        method: "post",
        handler: [
            checkHeader,
            async ({body}: Request, res: Response) => {
                //const result = await getPlacesByName(query.q);
                res.status(200).send({});
            }
        ]
    }
];