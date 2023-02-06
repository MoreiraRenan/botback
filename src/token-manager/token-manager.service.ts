import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenManagerService {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    async decodeUser(user: string): Promise<any> {
        return this.jwtService.decode(user)
    }

    async encodeUser(user: any): Promise<string> {
        return await this.jwtService.signAsync({ ...user })
    }
}
