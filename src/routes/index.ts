import { findURLRecord, routeToURL, shortenURL } from '../controllers';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1000 * 60, // 1 minute
  limit: 50,
  message: { error: 'Too many requests, please try again later.' },
});

const router = Router();

router.post('/', limiter, shortenURL);
router.get('/:id', routeToURL);
router.get('/:id/find', limiter, findURLRecord);

export default router;
