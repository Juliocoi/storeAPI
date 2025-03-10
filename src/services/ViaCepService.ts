import axios from 'axios';
import { logger } from '../config/logger';

interface iViaCepResponse {
  logradouro: string;
  localidade: string;
  estado: string;
}

export class ViaCepService {
  constructor() {}

  async getInfoViaCep(cep: string): Promise<iViaCepResponse> {
    const onlyNumberCep = cep.replace(/\D/g, ''); // Retira espaços, letras e caracteres especiais

    const cepFormatValidation = /^[0-9]{8}$/; // valida se o cep possui 8 dígitos

    if (!cepFormatValidation.test(onlyNumberCep)) {
      logger.error('The format of postal code is invalid');
      throw new Error('The format of postal code is invalid');
    }

    const viaCepResponse = await axios.get(
      `https://viacep.com.br/ws/${onlyNumberCep}/json/`,
    );

    if (viaCepResponse.data.erro) {
      logger.error('cep not found in ViaCEP database');
      throw new Error('CEP not found');
    }

    const { logradouro, localidade, estado } = viaCepResponse.data;

    return {
      logradouro,
      localidade,
      estado,
    };
  }
}
