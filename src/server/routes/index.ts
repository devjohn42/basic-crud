import { Router } from 'express';

import { AnimesController } from './../controllers';

const router = Router();

router.get('/', (_, res) => {
	return res.send('server running');
});

router.post('/create-anime', AnimesController.create);
router.get('/animes', AnimesController.getAll);
router.get('/anime/:id', AnimesController.getById);
router.delete('/delete-anime/:id', AnimesController.deleteById);
router.put('/update-anime/:id', AnimesController.updateById);

export { router };
