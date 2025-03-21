import httpResp from "./httpResp.js";
import { HttpError } from "./error.js";

function json(req, res, next) {
    try {
        let contentType = req.headers["content-type"];
        contentType = contentType === undefined ? undefined : contentType.toLowerCase();
        if (contentType === "application/json") {
            let body = [];
            req.on('data', chunk => {
                body.push(chunk);
            });
            req.on('end', () => {
                try {
                    body = Buffer.concat(body).toString();
                    try {
                        req.body = JSON.parse(body);
                    } catch (e) {
                        throw new HttpError({ statusCode: 400 });
                    }
                    next();
                } catch(e) {
                    httpResp.Error.default(req, res, e);
                }
            });
        } else {
            next();
        }
    } catch(e) {
        httpResp.Error.default(req, res, e);
    }
}

export default {
    json
}