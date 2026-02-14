import crypto from 'crypto';

const secret = crypto.randomBytes(32).toString('hex');
const refreshSecret = crypto.randomBytes(32).toString('hex');

console.log('JWT_SECRET=' + secret);
console.log('JWT_REFRESH_SECRET=' + refreshSecret); 