import httpResp from "./httpResp.js";

function json(req, res, next) {
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
                    next();
                } catch (e) {
                    httpResp.Error[400](req, res);
                }
            } catch(e) {
                httpResp.Error.unhandled(req, res, e);
            }
        });
    } else {
        next();
    }
}

export default {
    json
}