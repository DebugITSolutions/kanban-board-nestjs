import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Boards} from "./boards.entity";
import {Cards} from "./cards.entity";

@Entity()
export class Columns {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Boards, (boards) => boards.columns, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'board_id'})
    boards: Boards

    @OneToMany(() => Cards, (cards) => cards.columns, {onDelete: 'CASCADE'})
    cards: Cards[]
}