import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Boards} from "./boards.entity";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    email: string
    @Column()
    name: string
    @Column()
    password: string

    @ManyToOne(() => Boards, (boards) => boards.users, {onDelete: "CASCADE"})
    boards: Boards[]
}