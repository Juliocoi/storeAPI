import { Request, Response } from 'express';
import { UpdateStore } from '../services/UpdateStoreService';

export class UpdateStoreController {
  private service: UpdateStore;

  constructor() {
    this.service = new UpdateStore();
  }

  async update(req: Request, res: Response): Promise<any> {
    const id = req.params.id;
    const requestBody = req.body;

    try {
      const storeToUpdate = await this.service.updateStoreById(id, requestBody);

      if (!storeToUpdate) {
        return res.status(404).json({
          status: 'fail',
          message: 'You need pass a valid ID.',
        });
      }

      res.status(200).json({
        status: 'sucess',
        data: {
          storeToUpdate,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({
          status: 'fail',
          message: err.message,
        });
      }

      return res.status(400).json({
        status: 'fail',
        message: { erro: `An unexpected error occurred, ${err}` },
      });
    }
  }
}
