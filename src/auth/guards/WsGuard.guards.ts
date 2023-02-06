import { CanActivate, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { TokenManagerService } from "src/token-manager/token-manager.service";

import { UsersService } from "src/users/users.service";

@Injectable()
export class WsGuard implements CanActivate {

  constructor(
    @Inject('TokenManagerService') private readonly tokenService: TokenManagerService,
    @Inject('UserService') private readonly userService: UsersService,
  ) { }

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      return new Promise(async (resolve, reject) => {
        const decoded = await this.tokenService.decodeUser(bearerToken) 
        if(decoded != 'null' && decoded != null ){
          return this.userService.getUser(decoded.id).then(user => {
            if (user) {
              context.switchToHttp().getRequest().user = user
              resolve(true);
            } else {
              reject(false);
            }
          });
        }else{
          reject(false);
        }      
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
