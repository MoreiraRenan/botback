import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './schemas/user.entity';

@Injectable()
export class UsersService {
    constructor( @InjectRepository(UserEntity) private readonly reepository: Repository<UserEntity>){

    }

    async getUser(userID: number): Promise<UserEntity | any> {
        return await this.reepository.query(
            `SELECT a.nome,a.email,a.id,a.ativado,a.limit,a.senha from analista a where id = ${userID}`)
            .then(e => {
              return e[0]
            }).catch(e => {
                return e
            })
    }

    auth = async (login: string, password: string): Promise<UserEntity | boolean> => {
        const user = await this.reepository.query(
          `SELECT a.nome,a.email,a.id,a.ativado,a.limit,a.senha from analista a where a.ativado = 1 and email = '${login}'`).then(e => {
            return e[0]
          }).catch(erro => {
            console.log(erro)
            return false
          })
        if (!user) return false
        if (bcrypt.compareSync(password, user.senha)) {
          return user
         } else {
           return false
         }
      }
}
