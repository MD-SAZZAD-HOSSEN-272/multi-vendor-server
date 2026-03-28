import rateLimit from "express-rate-limit";


// 5 requests per minute
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime;
    const now = new Date();
    const diff = Math.ceil((resetTime - now) / 1000); // seconds

    return res.status(429).json({
      success: false,
      message: `Too many requests. Try again after ${Math.ceil(diff / 60)} minutes`,
      retryAfterSeconds: diff,
    });
  },
});