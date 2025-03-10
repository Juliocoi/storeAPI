import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Store } from '../models/store';

dotenv.config({ path: './src/config/.env' });

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!,
);

mongoose
  .connect(DB)
  .then(() => {
    console.info('Conected to MongoDB.');
  })
  .catch((err) => console.error('MongoDB not conected: ', err));

// Leitura do arquivo JSON
const data = JSON.parse(fs.readFileSync('./src/data/stores.json', 'utf-8'));

// Importa os dados para o banco de dados
const importData = async () => {
  try {
    await Store.create(data);
    console.log('Dados gravados com sucesso');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// Deletar todos os dados do banco.
const deleteData = async () => {
  try {
    await Store.deleteMany();
    console.log('Dados deletados com sucesso.');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
