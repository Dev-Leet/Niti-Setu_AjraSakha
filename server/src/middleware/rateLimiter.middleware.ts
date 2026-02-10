import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const eligibilityLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Eligibility check limit reached, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});