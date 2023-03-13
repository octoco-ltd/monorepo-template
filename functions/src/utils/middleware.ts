import { NextFunction, Request, Response } from 'express';
import * as firebaseAdmin from 'firebase-admin'
import * as httpCodes from 'http-status-codes';

export async function hasSuperAdminKey(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  // You need to store the AUTH key in some sort of environment variable (typically Firebase functions)
  if (authorization !== 'ABC')
    return res.status(httpCodes.StatusCodes.UNAUTHORIZED).send('Not authorized');
  return next();
}

// This is JWT Auth token middelware for Firebase API's
export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) return res.status(httpCodes.StatusCodes.UNAUTHORIZED).send('Unauthorized - Missing Authorization header');

  if (!authorization.startsWith('Bearer')) return res.status(httpCodes.StatusCodes.UNAUTHORIZED).send('Unauthorized - Missing Bearer <token>');

  const split = authorization.split('Bearer ');
  if (split.length !== 2) return res.status(httpCodes.StatusCodes.UNAUTHORIZED).send('Unauthorized - Missing Bearer <token> 2');

  const token = split[1];

  try {
    const decodedToken: firebaseAdmin.auth.DecodedIdToken = await firebaseAdmin.auth().verifyIdToken(token);

    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    return next();
  } catch (ex) {
    console.error('An error occurred:', ex);
    res.status(httpCodes.StatusCodes.UNAUTHORIZED).send('Unauthorized - Invalid token');
  }
}

/**
 * Uncomment this if we need to further validate whether
 * the user has the correct role to access a route.
 * If you uncomment this, make sure to add the user role to
 * the JWT as a custom claim upon registration (You can do so in the
 * `userSignupTasks` trigger in the index.ts file).
 * To use this, add it to the route that you want to secure: Ex. isAuthorized(['admin'])
 */
export function isAuthorized(requiredRoles: Array<string>, allowSameUser?: boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role, uid } = res.locals;
    const { id } = req.params;

    if (allowSameUser && id && uid === id) return next();

    if (!role) return res.sendStatus(httpCodes.StatusCodes.FORBIDDEN);

    if (requiredRoles.includes(role)) return next();

    return res.sendStatus(httpCodes.StatusCodes.FORBIDDEN);
  };
}
