import { Router } from 'express';
import { CreateStoreController } from '../controllers/CreateStoreController';
import { ListStoreController } from '../controllers/ListStoresController';
import { UpdateStoreController } from '../controllers/UpdateStoreController';
import { DeleteStoreController } from '../controllers/DeleteStoreController';

export const router = Router();

// Stores routes
const createStoreController = new CreateStoreController();
const listStoreController = new ListStoreController();

router.post('/store', createStoreController.create.bind(createStoreController));
// prettier-ignore
router.get('/store/:id', listStoreController.listStoreById.bind(listStoreController));
router.get('/stores', listStoreController.listAll.bind(listStoreController));

const updateStoreById = new UpdateStoreController();
router.put('/store/:id', updateStoreById.update.bind(updateStoreById));

const deleteStoreController = new DeleteStoreController();
// prettier-ignore
router.delete('/store/:id', deleteStoreController.DeleteStore.bind(deleteStoreController))
