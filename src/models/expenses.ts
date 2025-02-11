import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "expenses", freezeTableName: true, timestamps: true })
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
    defaultValue: DataType.NOW, // ✅ Sets default at database level
  })
  date!: Date;
}
