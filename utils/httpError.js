import http from "http";

// only for unhandled exception handler
export function httpUnhandledErrorHandler(req, res, error) {
    res.statusCode = 500;
    console.error(`error :: ${error.stack}`);
    res.end(error.stack);
}

export function httpErrorHandler(req, res, code, error) {
    res.statusCode = code;
    res.end(error.message);
}

export function http404Handler(req, res) {
    httpErrorHandler(req, res, 404, new Error(http.STATUS_CODES[404]));
}

