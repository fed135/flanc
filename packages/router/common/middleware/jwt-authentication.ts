import { addCustomAttribute } from 'newrelic';
import config from 'config';
import { model as legacyUserModel } from '@<project_name>/resource-user-legacy/model';
import { to } from '@<project_name>/core-util/async';
import { verifyToken } from '@<project_name>/core-util/jwt';
import { BadRequest, InternalError, Unauthorized } from '@<project_name>/core-util/errors';

type JwtAuthenticationOptions = {
  roles?: Array<string>
}

export default function jwtAuthentication(options?: JwtAuthenticationOptions) {
  if (!config.auth.jwtSecret) throw InternalError('JWT secret is not set.');

  return async function jwtAuthenticationMiddleware(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization || authorization.indexOf('Bearer ') === -1) return next(BadRequest('Invalid Token: Bearer auth type is mandatory', req.context));

    try {
      req.context.user = verifyToken(authorization.substring(7, authorization.length), config.auth.jwtSecret);
      addCustomAttribute('context.legacyUserId', req.context.user.legacyId);
    } catch (e) {
      return next(Unauthorized(e.message, req.context));
    }

    if (!req.context.user.legacyId) return next(BadRequest('Bad Token Format: Missing userId', req.context));

    if (options?.roles) {
      const unauthorizedError = Unauthorized(`User with legacy ID "${req.context.user.legacyId}" does not have one of the required roles "${options.roles.join(', ')}"`, req.context);

      if (req.context.user.roles) {
        return next(...(!req.context.user.roles.includes(...options.roles) ? [unauthorizedError] : []));
      }

      const [userError, user] = await to(legacyUserModel.findUserById({ context: req.context, params: { id: req.context.user.legacyId } }));
      if (userError || !user) return next(Unauthorized(userError ?? `User with legacy ID "${req.context.user.legacyId}" not found`));

      if (!user.roles.includes(...options.roles)) return next(unauthorizedError);
    }

    return next();
  };
}
