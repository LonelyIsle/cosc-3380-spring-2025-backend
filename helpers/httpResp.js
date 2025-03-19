import { HttpError } from "./error.js";

class Success {
    static 200(req, res, data) {
        res.setHeader("content-type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify({
            message: "success",
            data
        }));
    }
}

class Error {
    static default(req, res, error) {
        if (error instanceof HttpError && error.statusCode && Error[error.statusCode]) {
            Error[error.statusCode](req, res, error);
        } else {
            Error[500](req, res, error);
        }
    }

    static 500(req, res, error) {
        res.setHeader("content-type", "application/json");
        res.statusCode = 500;
        console.error(`error :: ${error.stack}`);
        res.end(JSON.stringify({
            message: (error && error.message) || "Internal Server Error",
            data: {}
        }));
    }

    static 404(req, res, error) {
        res.setHeader("content-type", "application/json");
        res.statusCode = 404;
        res.end(JSON.stringify({
            message: (error && error.message) || "Not Found",
            data: {}
        }));
    }

    static 400(req, res, error) {
        res.setHeader("content-type", "application/json");
        res.statusCode = 400;
        res.end(JSON.stringify({
            message: (error && error.message) || "Bad Request",
            data: {}
        }));
    }
}

export default {
    Success,
    Error,
}

