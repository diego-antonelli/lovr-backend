import {Request, Response} from "express";
import {getPlacesByName} from "../search/SearchController";
import {checkHeader} from "../../middleware/checks";

export default [
    {
        path: "/api/v1/profile/all",
        method: "get",
        handler: [
            checkHeader,
            async ({query}: Request, res: Response) => {
                const result = await getPlacesByName(query.q);
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