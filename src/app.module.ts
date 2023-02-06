import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule,    //cache requests
    CacheModule.register({
      ttl: 30, // seconds
      max: 10, // maximum number of items in cache
    }),
    //env config
    ServeStaticModule.forRoot({
      rootPath: resolve('./public/'),
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    //typeorm
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: 13306,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: ['dist/**/*.entity.js'],
      synchronize: false,

    })],
  controllers: [AppController],
  providers: [AppGateway, AppService],
  exports: [AppService]
})
export class AppModule { }
