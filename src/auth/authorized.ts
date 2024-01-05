// This fucntion checks if the incoming request user is authorized to access the route

import { NextFunction, Request, Response } from 'express';

interface IsAuthorizedOptions {
  hasRole: Array<'admin' | 'user'>;
  allowSameUser?: boolean;
}

function isAuthorized(options: IsAuthorizedOptions) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { role, email, uid } = res.locals;
    const { userId } = req.params;

    // Give myself access to all routes
    if (email === 'k.james.close@gmail.com') return next();
    // Optionally allow user to access their own stuff
    if (options.allowSameUser && userId && userId === uid) return next();

    if (options.hasRole.includes(role)) return next();
    return res.status(403).send('Unauthorized');
  };
}

export { isAuthorized };
