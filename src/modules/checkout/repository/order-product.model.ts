import { Table, Column, Model, ForeignKey, PrimaryKey, BelongsTo } from "sequelize-typescript";
import OrderModel from "./order.model";
import ProductModel from "../../store-catalog/repository/product.model";

@Table({
    tableName: "order_items",
    timestamps: false
})
export default class OrderProductModel extends Model {
    @PrimaryKey
    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    orderId: string;

    @PrimaryKey
    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    productId: string;

    @BelongsTo(() => OrderModel)
    order: OrderModel;

    @BelongsTo(() => ProductModel)
    product: ProductModel;
}
