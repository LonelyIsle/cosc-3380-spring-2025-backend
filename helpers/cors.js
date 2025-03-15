function cors(req, res, next) {
    let method = req.method.toUpperCase();
    if (method === 'OPTIONS') {
        // preflight
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE");
        res.setHeader("Access-Control-Request-Headers", "content-type")
        res.statusCode = 204;
        res.setHeader('Content-Length', '0');
        res.end();
    } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    }
}

export default cors