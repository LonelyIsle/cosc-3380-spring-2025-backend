import httpResp from "./httpResp.js";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

function json(req, res, next) {
    let contentType = req.headers["content-type"];
    if (contentType.toLowerCase() !== "application/json") {
        // multipart/form-data
        res.setHeader('content-type', 'application/json');
        next();
    } else {
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
                    httpResp.error400Handler(req, res);
                }
                res.setHeader('content-type', 'application/json');
                next();
            } catch(e) {
                httpResp.unhandledErrorHandler(req, res, e);
            }
        });
    } 
}

function formData(req, res, next) {
    upload(req, res, next);
}

export default {
    json,
    formData
}