import { Request, Response } from 'express';
import { DeleteStore } from '../services/DeleteStoreService';
import { logger } from '../config/logger';

export class DeleteStoreController {
  private service: DeleteStore;

  constructor() {
    this.service = new DeleteStore();
  }

  async DeleteStore(req: Request, res: Response): Promise<any> {
    const storeId = req.params.id;

    try {
      const storeToBeDelete = await this.service.deleteStoreById(storeId);

      if (!storeToBeDelete) {
        logger.error('delete controller');
        return res.status(404).json({
          status: 'fail',
          message: 'You need pass a valid ID.',
        });
      }

      res.status(204).json({
        status: 'sucess',
        message: null,
      });
    } catch (err) {
      if (err instanceof Error) {
        logger.error('error na delete Store.', err);
        return res.status(400).json({
          status: 'fail',
          message: err.message,
        });
      }

      logger.error('error desconhecido na delete Store.', err);
      return res.status(400).json({
        status: 'fail',
        message: { erro: `An unexpected error occurred, ${err}` },
      });
    }
  }
}
