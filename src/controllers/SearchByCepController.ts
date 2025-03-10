import { Request, Response } from 'express';
import { SearchCEP } from '../services/SearchCEPService';
import { Store } from '../models/store';
import { logger } from '../config/logger';

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

      const stores = await Store.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [
                geoLocationResponse.longitude,
                geoLocationResponse.latitude,
              ],
            },
            distanceField: 'distance',
            spherical: true,
            maxDistance: maxDistanteInMeters,
          },
        },
        {
          $addFields: {
            distance: { $divide: ['$distance', 1000] },
          },
        },
        {
          $project: {
            createdAt: false,
            updatedAt: false,
            __v: false,
          },
        },
      ]);
      logger.info('SearchByCepController: busca realizada com sucesso');
      return res.status(200).json({
        status: 'sucess',
        result: stores.length,
        data: {
          stores,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        logger.warn('SearchByCepController: erro ao buscar Store por CEP', err);

        return res.status(404).json({
          status: 'fail',
          message: err.message,
        });
      }
      // prettier-ignore
      logger.error("SearchByCepController: erro desconhecido ao buscar Store por CEP", err)

      return res.status(500).json({
        status: 'fail',
        message: `Error desconhecido:\b${err} `,
      });
    }
  }
}
