import { Router } from 'express';

import { AnimesController } from './../controllers';

const router = Router();

router.get('/', (_, res) => {
	return res.send('server running');
});

router.post('/create-anime', AnimesController.create);
router.get('/animes', AnimesController.getAll);

export { router };
