import { Router } from 'express';
import { AnimesController } from '../controllers/animes';

const router = Router();

router.get('/', (_, res) => {
	return res.send('server running');
});

router.post('/create-anime', AnimesController.create);

export { router };
