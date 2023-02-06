import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenManagerModule } from 'src/token-manager/token-manager.module';
import { UserEntity } from 'src/users/schemas/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './strategys/jwt.strategy';
import { LocalStrategy } from './strategys/local.strategy';

@Module({
  imports: [
    PassportModule,
    TokenManagerModule,
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy,UsersService],
  controllers: [AuthController]
})
export class AuthModule { }
