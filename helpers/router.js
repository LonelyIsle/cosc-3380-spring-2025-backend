import httpResp from "./httpResp.js";
import url from "./url.js"
import utils from "./utils.js";

const DEFAULT_HANDLER = (req, res) => {};
const REQ_PARAM_REGEX = /:[a-zA-z0-9%]+/;
const METHODS = ["GET", "PUT", "PATCH" , "POST", "DELETE"];

class RequestHandler {
    push(handler) {
        this.handlers.push(handler);
        this.compose();
    }

    compose() {
        if (this.handlers.length !== 0) {
            this.composition = this.handlers.reduceRight(
                (next, handler) => {
                    return (req, res) => handler(req, res, () => next(req, res));
                }, 
                (req, res) => this.lastHandler(req, res)
            );
        } else {
            this.composition = this.lastHandler;
        }
    }

    execute(req, res, composition) {
        if (typeof composition === "function") {
            this.lastHandler = composition;
        } else {
            this.lastHandler = DEFAULT_HANDLER;
        }
        this.composition(req, res);
    }

    constructor(handlers = []) {
        this.handlers = handlers;
        this.lastHandler = DEFAULT_HANDLER;
        this.compose();
    }
}

class Route {
    constructor(method, pathname, ...handlers) {
        this.method = method.toUpperCase();
        this.pathname = pathname;
        this.pathnameObj = url.getPathnameObj(pathname);
        this.handler = new RequestHandler(handlers);
    }
}

class Router {
    get(pathname, ...handlers) {
        this.routes.push(new Route("GET", pathname, ...handlers));
    }

    post(pathname, ...handlers) {
        this.routes.push(new Route("POST", pathname, ...handlers));
    }

    put(pathname, ...handlers) {
        this.routes.push(new Route("PUT", pathname, ...handlers));
    }

    patch(pathname, ...handlers) {
        this.routes.push(new Route("PATCH", pathname, ...handlers));
    }

    delete(pathname, ...handlers) {
        this.routes.push(new Route("DELETE", pathname, ...handlers));
    }

    all(pathname, ...handlers) {
        for (let method of METHODS) {
            this.routes.push(new Route(method, pathname, ...handlers));
        }
    }

    use(handler) {
        this.handler.push(handler);
    }

    getReqQuery(req) {
        let urlParams = req.urlObj.searchParams;
        let result = {}
        for(let [key, value] of urlParams.entries()) { 
            [result[key]] = utils.parseStr(value);
        }
        return result;
    }
    
    getReqParam(req, route) {
        const reqPathname = req.urlObj.pathname;
        const reqPaths = reqPathname.slice(1).split("/");
        const routePathnames = route.pathname.slice(1).split("/");
        let result = {};
        for (let [i, pathname] of routePathnames.entries()) {
            if (REQ_PARAM_REGEX.test(pathname)) {
                [result[pathname.slice(1)]] = utils.parseStr(reqPaths[i]);
            }
        }
        return result
    }

    match(req, route) {
        if (req.method !== route.method ) {
            return false;
        }
        if (route.pathname === "/*") {
            return true;
        }
        if (req.urlObj.pathname === route.pathname) {
            return true;
        }
        const reqPathname = req.urlObj.pathname;
        const reqPathnames = reqPathname.slice(1).split("/");
        const routePathnamess = route.pathname.slice(1).split("/");
        if (reqPathnames.length != routePathnamess.length) {
            return false;
        }
        for (let [i, pathname] of routePathnamess.entries()) {
            if (!REQ_PARAM_REGEX.test(pathname) && (routePathnamess[i].toLowerCase() !== decodeURI(reqPathnames[i]).toLowerCase())) {
                return false;
            }
        }
        return true;
    }

    handle(req, res) {
        req.urlObj = url.getURLObj(req.url);
        req.query = this.getReqQuery(req);
        req.body = req.body ? req.body : {};
        let matchedRoute = null;
        for(let route of this.routes) {
            if (this.match(req, route)) {
                req.param = this.getReqParam(req, route);
                matchedRoute = route;
                break;
            }
        }
        if (matchedRoute === null) {
            this.handler.execute(req, res, httpResp.Error[404]);
        } else {
            this.handler.execute(req, res, matchedRoute.handler.composition);
        }
    }

    constructor() {
        this.routes = [];
        this.handler = new RequestHandler();
    }
}

export default Router;