"use strict";
// This fucntion checks if the incoming request user is authorized to access the route
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
function isAuthorized(options) {
    return function (req, res, next) {
        const { role, email, uid } = res.locals;
        const { userId } = req.params;
        // Give myself access to all routes
        if (email === 'k.james.close@gmail.com')
            return next();
        // Optionally allow user to access their own stuff
        if (options.allowSameUser && userId && userId === uid)
            return next();
        if (options.hasRole.includes(role))
            return next();
        return res.status(403).send('Unauthorized');
    };
}
exports.isAuthorized = isAuthorized;
