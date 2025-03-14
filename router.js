import { URL, URLSearchParams } from "url"

// Route
class Route {
    dispatch(req, res, handlers) {
        if (this.midHandlers.length === 0 && handlers.length === 0) {
            return this.lastHandler(req, res);
        }
        let routeComposition = this.midHandlers.reduceRight(
            (next, middleware) => () => middleware(req, res, next), 
            () => this.lastHandler(req, res)
        );
        let composition = handlers.reduceRight(
            (next, middleware) => () => middleware(req, res, next), 
            () => routeComposition()
        );
        composition();
    }

    constructor(method, path, ...handlers) {
        this.method = method.toUpperCase();
        this.path = path;
        this. urlObj = new URL(`http://fakehost${path}`);
        this.lastHandler = handlers.pop();
        this.midHandlers = handlers;
    }
}

// Router
class Router {
    REQ_PARAM_REGEX = /:[a-zA-z0-9%]+/g;
    METHODS = ["GET", "POST", "PUT", "DELETE"];

    get(path, ...handlers) {
        this.routes.push(new Route("GET", path, ...handlers));
    }

    post(path, ...handlers) {
        this.routes.push(new Route("POST", path, ...handlers));
    }

    put(path, ...handlers) {
        this.routes.push(new Route("PUT", path, ...handlers));
    }

    delete(path, ...handlers) {
        this.routes.push(new Route("DELETE", path, ...handlers));
    }

    all(path, ...handlers) {
        for (let method of this.METHODS) {
            this.routes.push(new Route(method, path, ...handlers));
        }
    }

    use(handler) {
        this.midHandlers.push(handler);
    }

    getURLQuery(req) {
        let urlObj = req.urlObj;
        let urlParams = new URLSearchParams(urlObj.search);
        let result = {}
        for(let [key, value] of urlParams.entries()) { 
            result[key] = value;
        }
        return result;
    }

    getURLParam(req, route) {
        const reqPathname = req.urlObj.pathname;
        const reqPaths = reqPathname.split("/");
        const routePaths = route.path.split("/");
        let result = {};
        for (let [i, path] of routePaths.entries()) {
            const regex = this.REQ_PARAM_REGEX;
            const found = path.match(regex);
            if (found !== null) {
                result[path.slice(1)] = decodeURI(reqPaths[i]);
            }
        }
        return result
    }

    match(req, route) {
        if (req.method !== route.method ) {
            return false;
        }
        if (route.path === "/*") {
            return true;
        }
        if (req.urlObj.pathname === route.path) {
            return true;
        }
        const reqPathname = req.urlObj.pathname;
        const reqPaths = reqPathname.split("/");
        const routePaths = route.path.split("/");
        if (reqPaths.length != routePaths.length) {
            return false;
        }
        for (let [i, path] of routePaths.entries()) {
            const regex = this.REQ_PARAM_REGEX;
            const found = path.match(regex);
            if (found === null && routePaths[i].toLowerCase() !== decodeURI(reqPaths[i]).toLowerCase()) {
                return false;
            }
        }
        return true;
    }

    handle(req, res) {
        req.urlObj = new URL(`http://fakehost${req.url}`);
        req.query = this.getURLQuery(req);
        for(let route of this.routes) {
            if (this.match(req, route)) {
                req.param = this.getURLParam(req, route);
                route.dispatch(req, res, this.midHandlers);
                break;
            }
        }
    }

    constructor() {
        this.routes = [];
        this.midHandlers = [];
    }
}

export default Router;