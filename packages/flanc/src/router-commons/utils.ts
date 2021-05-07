import { BadRequest } from '../errors';
import config from 'config';

function guardAgainstForbiddenIncludePattern(includeVal: string[], includeParam?: Serializable, context?: Context) {
  if (!includeVal || includeVal.length === 0) return;
  if (!includeParam) return;

  const includeRules = includeParam['x-include-rules'] || {};
  const relationships = includeParam['x-direct-relations'];
  const whitelist = includeRules.whitelist || [];
  const blacklist = includeRules.blacklist || [];
  let maxDepth = includeRules['max-depth'];
  if (maxDepth === null || maxDepth === undefined) maxDepth = config.routers.json.maxRelationshipDepth;

  for (let i = 0; i < includeVal.length; i++) {
    const rejectReason = (
      ((includeVal[i].split('.').length > maxDepth && !whitelist.includes(includeVal[i])) && 'Too much nesting') ||
      (blacklist.includes(includeVal[i]) && 'Relationship forbidden') ||
      (!relationships.includes(includeVal[i].split('.')[0]) && 'Not a relationship') ||
      null
    );

    if (rejectReason !== null) throw BadRequest(`Invalid include value ${includeVal[i]}: ${rejectReason}`, context);
  }
}

export const path = {
  guardAgainstForbiddenIncludePattern,
};
