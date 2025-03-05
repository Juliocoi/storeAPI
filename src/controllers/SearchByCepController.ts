import { Request, Response } from 'express';
import { SearchCEP } from '../services/SearchCEPService';
import { Store } from '../models/store';

export class SearchByCepController {
  private service: SearchCEP;

  constructor() {
    this.service = new SearchCEP();
  }

  async SearchByCEP(req: Request, res: Response): Promise<any> {
    const { cep } = req.params;

    const maxDistanteInMeters: number = 100000; // 150km em metros

    try {
      const geoLocationResponse = await this.service.getCoordinateByCep(cep);

      const userCoordenates = {
        type: 'Point',
        coordinates: [
          geoLocationResponse.longitude,
          geoLocationResponse.latitude,
        ],
      };

      const stores = await Store.find({
        location: {
          $near: {
            $geometry: userCoordenates,
            $maxDistance: maxDistanteInMeters,
          },
        },
      });

      return res.status(200).json({
        status: 'sucess',
        data: {
          stores,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(404).json({
          status: 'fail',
          message: err.message,
        });
      }
      return res.status(500).json({
        status: 'fail',
        message: `Error desconhecido:\b${err} `,
      });
    }
  }
}
