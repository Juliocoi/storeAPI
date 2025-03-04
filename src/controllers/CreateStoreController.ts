import { Request, Response } from 'express';
import { CreateStoreService } from '../services/CreateStoreService';

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
      return res.status(201).json(newStore);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(500).json({ error: 'erro loja não criada' });
    }
  }
}
