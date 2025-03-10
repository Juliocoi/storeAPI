import { Request, Response } from 'express';
import { StoreList } from '../services/ListStoresService';
import { logger } from '../config/logger';

export class ListStoreController {
  private service: StoreList;

  constructor() {
    this.service = new StoreList();
  }

  async listAll(req: Request, res: Response): Promise<any> {
    try {
      const listStores = await this.service.listAllStores();
      logger.info('Busca por todas as lojas realizada com sucesso');

      return res.status(200).json({
        status: 'sucess',
        data: {
          listStores,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        logger.error('erro ao listar todas as lojas', err);

        return res.status(400).json({
          status: 'fail',
          message: err.message,
        });
      }

      logger.error('erro desconhecido ao listar todas as lojas', err);

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
        logger.warn('ListStoresController: O id informado não localizado');
        return res.status(404).json({
          status: 'fail',
          message: 'You need pass a valid ID.',
        });
      }
      logger.info('Busca por loja realizada com sucesso');

      return res.status(200).json({
        status: 'sucess',
        data: {
          searchById,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        logger.error('erro ao listar store', err);

        return res.status(500).json({
          status: 'fail',
          message: err.message,
        });
      }

      logger.error('erro desconhecido ao listar Store:', err);

      return res.status(500).json({
        status: 'fail',
        message: { erro: `An unexpected error occurred, ${err}` },
      });
    }
  }
}
