import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Columns} from "./columns.entity";
import {Users} from "./users.entity";

@Entity()
export class Boards {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @OneToMany(() => Columns, (column) => column.boards, {onDelete: 'CASCADE'})
    columns: Columns[]

    @OneToMany(() => Users, (users) => users.boards, {onDelete: 'CASCADE'})
    users: Users[]
}