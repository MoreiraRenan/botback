import { Controller, Get } from '@nestjs/common';
import { AppGateway } from './app.gateway';

@Controller()
export class AppController {
    constructor(private readonly service: AppGateway) {

    }
    @Get('qr')
    async getHello() {
        return "Ola";
    }
}
