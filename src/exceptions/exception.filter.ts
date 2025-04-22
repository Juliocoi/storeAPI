import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Obtém status e mensagem com base no tipo de exceção
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let errorType = 'ERRO_INTERNO';

    // Para exceções HTTP do NestJS
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Se a resposta da exceção já estiver formatada como objeto
      if (typeof exceptionResponse === 'object') {
        const errorObj = exceptionResponse as any;
        message = errorObj.message || message;
        errorType = errorObj.error || errorType;
      } else {
        // Se for apenas uma string
        message = exceptionResponse as string;
      }
    }
    // Para erros JavaScript padrão
    else if (exception instanceof Error) {
      // Mantém a mensagem do erro
      message = exception.message;
    }
    // Registra o erro no console para debugging
    console.error(`[App Exception] ${status} ${message}`, exception);

    // Envia resposta formatada para o cliente
    response.status(status).json({
      statusCode: status,
      message: message,
      error: errorType,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}