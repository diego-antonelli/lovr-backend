import {Request, Response} from "express";
import {login} from "./LoginController";
import {LoginRequest} from "../../models";
import {checkLoginBody} from "../../middleware/checks";

export default [
    {
        path: "/api/v1/login",
        method: "post",
        handler: [
            checkLoginBody,
            async ({body}: Request, res: Response) => {
                const result = await login(body as LoginRequest, res);
                res.status(200).send(result);
            }
        ]
    }
];