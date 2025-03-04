import { Router } from 'express';
import { CreateStoreController } from '../controllers/createStoreController';

export const router = Router();

// Stores routes
const createStoreController = new CreateStoreController();

router.post('/store', createStoreController.create.bind(createStoreController));
