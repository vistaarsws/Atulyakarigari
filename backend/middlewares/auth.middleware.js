import jwt from "jsonwebtoken"
import "dotenv/config"
import { badRequest, internalServerError, notFoundRequest } from "../helpers/api-response.js";

export const auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookies.token ||
            req.body.token ||
            (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);
        // req.header("Authorization").replace("Bearer ", "");
        // if token missing , then return response
        if (!token) {
            return notFoundRequest(req, res, null, "token is missing");
        }
        // verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(`decode : - > ${JSON.stringify(decode, null, 2)}`);
            req.user = decode
        } catch (err) {
            return badRequest(req, res, null, "token is invalid");
        }
        next()
    } catch (err) {
        console.log(err);
        return internalServerError(req, res, err, "something went wrong while validating token");
    }
}

// is user
export const isUser = async (req, res, next) => {
    try {
        const user = req.user
        if (user.accountType === "student") {
            next()
        } else {
            return badRequest(req, res, null, "you are not an admin")
        }
    } catch (err) {
        console.log(err);
        return internalServerError(req, res, null, "user role cannot be verified");
    }
}

// is admin
export const isAdmin = (req, res, next) => {
    try {
        const user = req.user
        if (user.accountType === "admin") {
            next()
        } else {
            return badRequest(req, res, null, "you are not an admin")
        }
    } catch (error) {
        console.log(error);
        return internalServerError(req, res, null, "user role cannot be verified");
    }
}

