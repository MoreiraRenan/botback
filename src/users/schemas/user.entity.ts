import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('analista')
export class UserEntity {
    @PrimaryGeneratedColumn('increment') id: number

    @Column('varchar', { length: 100 })
    nome: string

    @Column('varchar', { length: 100 })
    email: string

    @Column('bool')
    ativado: boolean

    @Column('int')
    limit: number

    @Column('varchar', { length: 150 })
    senha: string

}
