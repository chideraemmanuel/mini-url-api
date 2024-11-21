import { routeToURL, shortenURL } from '../controllers';
import { Router } from 'express';

const router = Router();

router.post('/', shortenURL);
router.get('/:id', routeToURL);

export default router;
