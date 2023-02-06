import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { TokenManagerService } from './token-manager.service';

@Global()
@Module({
  imports: [
    JwtModule.register({ secret: jwtConstants.secret, signOptions: { expiresIn: '604800s' } })
  ],
  providers: [TokenManagerService],
  exports: [TokenManagerService]
})
export class TokenManagerModule { }
