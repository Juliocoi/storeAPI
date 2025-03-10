import app from './app';
import { logger } from './config/logger';
const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`App rodando na porta ${PORT}, ao infinito e além!.`);
});
