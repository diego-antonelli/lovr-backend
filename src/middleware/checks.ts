import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";

export const checkSearchParams = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.q) {
        throw new HTTP400Error("Missing q parameter");
    } else {
        next();
    }
};

export const checkLoginBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body.email || !req.body.password) {
        throw new HTTP400Error("Missing email or password parameter");
    } else {
        next();
    }
};

export const checkHeader = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.header("lovr-api-key")) {
        throw new HTTP400Error("Missing API Key");
    } else {
        next();
    }
};