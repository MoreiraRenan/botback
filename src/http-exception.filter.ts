import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    catch(error: Error, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const status = (error instanceof HttpException) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        // if (status === HttpStatus.UNAUTHORIZED) 
        //     return response.status(status).render('views/401');
        if (status === HttpStatus.NOT_FOUND) {
            return response.status(200).render('index.hbs');
        } else {
            if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
                if (process.env.NODE_ENV === 'production') {
                    console.error(error.stack);
                    return response.status(status).json({
                        statusCode: status,
                        timestamp: new Date().toISOString(),
                        message: error.message
                    });
                }
                else {
                    const message = error.stack;
                    return response.status(status).send(message);
                }
            } else {
                const ctx = host.switchToHttp();
                const request = ctx.getRequest<Request>();
                response.status(status)
                    .json({
                        statusCode: status,
                        message: error.message,
                        timestamp: new Date().toISOString(),
                        path: request.url,
                    });
            }
        }
    }
}