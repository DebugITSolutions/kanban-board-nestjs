import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
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

    @ManyToMany(() => Users, {onDelete: 'CASCADE'})
    @JoinTable({name: 'boards_users'})
    users: Users[]
}