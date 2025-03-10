import { Request, Response } from 'express';
import { SearchAdress } from '../services/NominatimService';
import { ViaCepService } from '../services/ViaCepService';
import { Store } from '../models/store';
import { logger } from '../config/logger';

export class SearchByCepController {
  private nominatimService: SearchAdress;
  private viaCepService: ViaCepService;

  constructor() {
    this.viaCepService = new ViaCepService();
    this.nominatimService = new SearchAdress();
  }

  async SearchByCEP(req: Request, res: Response): Promise<any> {
    const { cep } = req.params;

    const maxDistanteInMeters: number = 100000; // 150km em metros

    try {
      const { logradouro, localidade, estado } =
        await this.viaCepService.getInfoViaCep(cep);

      const geoLocationResponse =
        await this.nominatimService.getCoordinateByAdress(
          logradouro,
          localidade,
          estado,
        );

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
      logger.info(
        `SearchByCepController: busca realizada com sucesso para o cep: ${cep}`,
      );

      //Caso o não haja lojas próximo.
      if (stores.length === 0) {
        logger.warn(
          'Busca realizada com sucesso, mas sem lojas próximas ao cep:' + cep,
        );
        return res.status(200).json({
          status: 'sucess',
          messagem: 'Não há lojas em sua região',
        });
      }

      return res.status(200).json({
        status: 'sucess',
        result: stores.length,
        data: {
          stores,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        logger.warn(
          `SearchByCepController: erro ao buscar Store por CEP:${cep}`,
          err,
        );

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
