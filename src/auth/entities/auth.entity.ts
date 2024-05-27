import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn} from 'typeorm'


@Entity( )
export class Auth {
  @PrimaryGeneratedColumn()
  id:string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
