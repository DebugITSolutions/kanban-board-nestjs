import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Columns} from "./columns.entity";

@Entity()
export class Cards {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Columns, columns => columns.cards, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'column_id'})
    columns: Columns
}