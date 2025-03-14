// only for unhandled exception handler
function httpUnhandledErrorHandler(req, res, error) {
    res.statusCode = 500;
    console.error(`error :: ${error.stack}`);
    res.end(error.stack);
}

function httpErrorHandler(req, res, code, error) {
    res.statusCode = code;
    res.end(error.message);
}

function http404Handler(req, res, next) {
    httpErrorHandler(req, res, 404, new Error("Not Found"));
}

export {
    httpUnhandledErrorHandler,
    httpErrorHandler,
    http404Handler
}

