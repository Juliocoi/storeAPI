import { Request, Response } from 'express';
import { StoreList } from '../services/ListStoresService';

export class ListStoreController {
  private service: StoreList;

  constructor() {
    this.service = new StoreList();
  }

  async listAll(req: Request, res: Response): Promise<any> {
    try {
      const listStores = await this.service.listAllStores();

      return res.status(200).json({
        status: 'sucess',
        data: {
          listStores,
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
        message: err,
      });
    }
  }

  async listStoreById(req: Request, res: Response): Promise<any> {
    const store = req.params.id;

    try {
      const searchById = await this.service.listStoreById(store);

      if (!searchById) {
        return res.status(404).json({
          status: 'fail',
          message: 'You need pass a valid ID.',
        });
      }

      return res.status(200).json({
        status: 'sucess',
        data: {
          searchById,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({
          status: 'fail',
          message: err.message,
        });
      }

      return res.status(500).json({
        status: 'fail',
        message: { erro: `An unexpected error occurred, ${err}` },
      });
    }
  }
}
