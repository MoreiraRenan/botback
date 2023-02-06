
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        type: String,
        description: 'email'
    })
    readonly login: string;
    @ApiProperty({
        type: String,
        description: 'User password'
    })
    readonly password: string;
}