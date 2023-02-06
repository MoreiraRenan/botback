import { Body, Controller, HttpStatus, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Userlogged } from './dto/userlogged.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { LocalAuthGuard } from './guards/local-auth.guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiResponse({ status: HttpStatus.OK, type: Userlogged, isArray: false, description: 'Success!' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Wrong user or passaword.' })
    @ApiOperation({ summary: 'Login user', description: 'Login user' })
    async login(@Request() req, @Body() LoginData: LoginDto) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    @ApiBearerAuth('JWT')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: false, description: 'Success!' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Wrong access token.' })
    @ApiOperation({ summary: 'User info', description: 'User info' })
    getProfile(@Req() req) {
        //return this.authService.getPermissaoUser(req.user);
        return req.user;
    }
}
