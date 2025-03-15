import { URL, URLSearchParams } from "url"

const REQ_PARAM_REGEX = /:[a-zA-z0-9%]+/g;

function getURLObj(url) {
    if (!URL.canParse(url)) {
        url = `http://fakehost${url}`;
    }
    return URL.parse(url);
}

function getPathnameObj(pathname) {
    if (!URL.canParse(pathname)) {
        pathname = `http://fakehost${pathname}`;
    }
    return URL.parse(pathname);
}

function getReqQuery(req) {
    let urlObj = req.urlObj;
    let urlParams = new URLSearchParams(urlObj.search);
    let result = {}
    for(let [key, value] of urlParams.entries()) { 
        result[key] = value;
    }
    return result;
}

function getReqParam(req, route) {
    const reqPathname = req.urlObj.pathname;
    const reqPaths = reqPathname.split("/");
    const routePathnames = route.pathname.split("/");
    let result = {};
    for (let [i, pathname] of routePathnames.entries()) {
        const regex = REQ_PARAM_REGEX;
        const found = pathname.match(regex);
        if (found !== null) {
            result[pathname.slice(1)] = decodeURI(reqPaths[i]);
        }
    }
    return result
}

export default {
    getURLObj,
    getPathnameObj,
    getReqParam,
    getReqQuery
}