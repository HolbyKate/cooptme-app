import NodeCache from 'node-cache';

// Cache pendant 15 minutes
export const jobsCache = new NodeCache({ stdTTL: 900 });