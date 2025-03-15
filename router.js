import url from "./helpers/url.js"

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

    constructor(method, pathname, ...handlers) {
        this.method = method.toUpperCase();
        this.pathname = pathname;
        this.pathnameObj = url.getPathnameObj(pathname);
        this.lastHandler = handlers.pop();
        this.midHandlers = handlers;
    }
}

// Router
class Router {
    METHODS = ["GET", "POST", "PUT", "DELETE"];

    get(pathname, ...handlers) {
        this.routes.push(new Route("GET", pathname, ...handlers));
    }

    post(pathname, ...handlers) {
        this.routes.push(new Route("POST", pathname, ...handlers));
    }

    put(pathname, ...handlers) {
        this.routes.push(new Route("PUT", pathname, ...handlers));
    }

    delete(pathname, ...handlers) {
        this.routes.push(new Route("DELETE", pathname, ...handlers));
    }

    all(pathname, ...handlers) {
        for (let method of this.METHODS) {
            this.routes.push(new Route(method, pathname, ...handlers));
        }
    }

    use(handler) {
        this.midHandlers.push(handler);
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
        const reqPathnames = reqPathname.split("/");
        const routePathnamess = route.pathname.split("/");
        if (reqPathnames.length != routePathnamess.length) {
            return false;
        }
        for (let [i, path] of routePathnamess.entries()) {
            const regex = this.REQ_PARAM_REGEX;
            const found = path.match(regex);
            if (found === null && (routePathnamess[i].toLowerCase() !== decodeURI(reqPathnames[i]).toLowerCase())) {
                return false;
            }
        }
        return true;
    }

    handle(req, res) {
        req.urlObj = url.getURLObj(req.url);
        req.query = url.getReqQuery(req);
        for(let route of this.routes) {
            if (this.match(req, route)) {
                req.param = url.getReqParam(req, route);
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