import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  return res.send('server running');
});

export { router };
