
import { ApiProperty } from '@nestjs/swagger';

export class Userlogged {
    @ApiProperty({
        type: String,
        description: 'User username'
    })
    readonly access_token: string;
    @ApiProperty({
        type: Boolean,
        description: 'User perfil'
    })
    readonly isAdmin: boolean;
    @ApiProperty({
        type: String,
        description: 'User name'
    })
    readonly nome: string;
}