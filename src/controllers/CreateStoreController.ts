import { Request, Response } from 'express';
import { CreateStoreService } from '../services/CreateStoreService';
import { logger } from '../config/logger';

export class CreateStoreController {
  private service: CreateStoreService;

  constructor() {
    this.service = new CreateStoreService();
  }

  async create(req: Request, res: Response): Promise<any> {
    const { name, address, bairro, city, uf, cep, longitude, latitude } =
      req.body;

    try {
      const newStore = await this.service.createStore(
        name,
        address,
        bairro,
        city,
        uf,
        cep,
        longitude,
        latitude,
      );
      logger.info('Loja criada com sucesso');
      return res.status(201).json(newStore);
    } catch (err) {
      if (err instanceof Error) {
        logger.error('Erro ao criar loja:', err);
        return res.status(500).json({ error: err.message });
      }
      logger.error('Erro ao criar loja:', err);
      return res.status(500).json({ error: 'erro loja não criada' });
    }
  }
}
