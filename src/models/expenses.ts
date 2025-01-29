
import { Table, Column, Model, DataType } from "sequelize-typescript";
   

// export interface Expense {
//   id: number;
//   description: string;
//   amount: number;
//   date: string;
//   category?: string;
// }

@Table
export default class Expense extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: Date;
}
