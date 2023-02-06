import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TokenManagerService } from 'src/token-manager/token-manager.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService)) private  userService: UsersService,
        private readonly tokenManager: TokenManagerService
        ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        try {
            const user : any = await this.userService.auth(username, pass)
            if(user) {
                delete user.senha
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error.message)
            console.log(error.statusCode)
            return null;
        }
    }

    async login(user: any) {        
        return {
        
            accessToken: await this.tokenManager.encodeUser(user),
            name: user.nome,
            id:user.id
        };
    }
}
