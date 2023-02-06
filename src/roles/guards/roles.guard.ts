
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenManagerService } from 'src/token-manager/token-manager.service';
import { UsersService } from '../../users/users.service';
 
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, @Inject('TokenManagerService') private readonly tokenService: TokenManagerService, @Inject('UserService') private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
    
      const request = context.switchToHttp().getRequest();
      if(!request.headers.authorization) return false
      const user : any = await this.tokenService.decodeUser(request.headers.authorization.split(" ")[1])
      if(!user) return false
      if(!user.id) return false
      const userRoles = await this.userService.getUser(user.id);
      if(!userRoles) return false
      if(!userRoles.permissao) return false
      const permissoesAR = userRoles.permissao.split(',')
      // return roles.map((r) => r.toLowerCase()).includes('editar')
      return roles.some(role => permissoesAR.includes(role))
    } catch (error) {
      console.log(error)
      return false
    }
  }
}