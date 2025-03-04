import { Router } from 'express';
import { CreateStoreController } from '../controllers/CreateStoreController';
import { ListStoreController } from '../controllers/ListStoresController';

export const router = Router();

// Stores routes
const createStoreController = new CreateStoreController();
const listStoreController = new ListStoreController();

router.post('/store', createStoreController.create.bind(createStoreController));
// prettier-ignore
router.get('/store/:id', listStoreController.listStoreById.bind(listStoreController));
router.get('/stores', listStoreController.listAll.bind(listStoreController));
