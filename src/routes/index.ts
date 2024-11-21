import { findURLRecord, routeToURL, shortenURL } from '../controllers';
import { Router } from 'express';

const router = Router();

router.post('/', shortenURL);
router.get('/:id', routeToURL);
router.get('/:id/find', findURLRecord);

export default router;
