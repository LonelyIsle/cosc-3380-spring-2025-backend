import { HttpError } from "./error.js";
import jwt from "./jwt.js";
import httpResp from "./httpResp.js";

const GUEST = -2;
const CUSTOMER = -1;
const STAFF= 0;
const MANAGER = 1;

function is(...roles) {
    return (req, res, next) => {
        try {
            let token =  (req.body && req.body.authorization) || req.headers["authorization"];
            if (!token && roles.indexOf(GUEST) > -1) {
                next();
                return;
            }
            if (!token) {
                throw new HttpError({ statusCode: 401 });
            }
            try {
                var { exp, iat, data } = jwt.verify(token);
            } catch (e) {
                throw new HttpError({ statusCode: 401, message: "Invalid token."});
            }
            if (roles.indexOf(data.role) > -1) {
                req.jwt = {
                    token,
                    exp,
                    iat,
                    user: data
                }
            } else {
                throw new HttpError({ statusCode: 401 });
            }
            next();
        } catch(e) {
            httpResp.Error.default(req, res, e);
        }
    }
}

function attach() {
    return (req, res, next) => {
        try {
            let token = req.headers["authorization"] || req.body.authorization;
            if (!token) {
                req.jwt = null;
            } else {
                try {
                    var { exp, iat, data } = jwt.verify(token);
                    req.jwt = {
                        token,
                        exp,
                        iat,
                        user: data
                    }
                } catch (e) {
                    req.jwt = null;
                }
            }
            next();
        } catch(e) {
            httpResp.Error.default(req, res, e);
        }
    }
}

export default {
    GUEST,
    CUSTOMER,
    STAFF,
    MANAGER,
    is,
    attach
}