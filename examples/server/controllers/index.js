import { Router } from 'express';
import renderer from './renderer';

const router = new Router();

router.use(renderer);

export default router;
