function cors(req, res, next) {
    try {
        console.log("CORS");
        let method = req.method.toUpperCase();
        if (method === 'OPTIONS') {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")
            res.statusCode = 204;
            res.setHeader('Content-Length', '0');
            res.end();
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*");
            next();
        }
    } catch(e) {
        httpResp.Error.default(req, res, e);
    }
}

export default cors