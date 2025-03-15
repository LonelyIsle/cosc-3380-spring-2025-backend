// only for unhandled exception handler
function unhandledErrorHandler(req, res, error) {
    res.statusCode = 500;
    console.error(`error :: ${error.stack}`);
    res.end(error.stack);
}

function errorHandler(req, res, code, error) {
    res.statusCode = code;
    res.end(error.message);
}

function error404Handler(req, res, next) {
    errorHandler(req, res, 404, new Error("Not Found"));
}

export default {
    unhandledErrorHandler,
    errorHandler,
    error404Handler
}

