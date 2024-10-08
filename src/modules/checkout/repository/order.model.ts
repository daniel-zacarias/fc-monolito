import { Table, Column, Model, PrimaryKey, BelongsToMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import OrderProductModel from "./order-product.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import ProductModel from "../../store-catalog/repository/product.model";

@Table({
    tableName: "order",
    timestamps: false
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false })
    clientId: string;

    @BelongsTo(() => ClientModel)
    client: ClientModel;

    @BelongsToMany(() => ProductModel, () => OrderProductModel)
    products: ProductModel[];

    @Column({ allowNull: false })
    status: string;
}