
import { Column, PrimaryKey, Table, Model } from "sequelize-typescript";

@Table({
    modelName: 'product-registration-table',
    tableName: "products",
    timestamps: false
})
export default class ProductModelRegistration extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    description: string;

    @Column({ allowNull: false })
    purchasePrice: number;

    @Column({ allowNull: false })
    salesPrice: number;

    @Column({ allowNull: false })
    stock: number;

    @Column({ allowNull: false })
    createdAt: Date;

    @Column({ allowNull: false })
    updatedAt: Date;
}