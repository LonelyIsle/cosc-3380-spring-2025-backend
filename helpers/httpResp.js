class Success {
    static 200(req, res, message, data) {
        res.setHeader("content-type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify({
            message,
            data
        }));
    }
}

class Error {
    static unhandled(req, res, error) {
        res.setHeader("content-type", "application/json");
        res.statusCode = 500;
        console.error(`error :: ${error.stack}`);
        res.end(error.stack);
    }

    static 404(req, res) {
        res.setHeader("content-type", "application/json");
        res.statusCode = 404;
        res.end("Not Found");
    }

    static 400(req, res) {
        res.setHeader("content-type", "application/json");
        res.statusCode = 400;
        res.end("Bad Request");
    }
}

export default {
    Success,
    Error,
}

