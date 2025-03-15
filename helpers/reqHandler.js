class RequestHandler {
    push(handler) {
        this.handlers.push(handler);
    }

    pushMany(handlers) {
        for (let handler of handlers) {
            this.push(handler);
        }
    }

    compose(req, res, next) {
        if (this.handlers.length !== 0) {
            return this.handlers.reduceRight(
                (next, handler) => {
                    return () => handler(req, res, next);
                }, 
                typeof next === "function" ? next : () => {} // dummy next() for last handler
            );
        } else {
            return () => { 
                if (typeof next === "function") {
                    next() 
                }
            };
        }
    }

    constructor(handlers) {
        this.handlers = handlers == null ? [] : handlers;
    }
}

export default RequestHandler;