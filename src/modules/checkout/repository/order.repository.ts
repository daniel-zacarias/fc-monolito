import Id from "../../@shared/domain/value-object/id.value-object";
import { ClientModel } from "../../client-adm/repository/client.model";
import ProductModel from "../../store-catalog/repository/product.model";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";

export class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {

        await OrderModel.create({
            id: order.id.id,
            clientId: order.client.id.id,
            status: order.status,
        });
        const products = order.products.map((product) =>
            OrderProductModel.create({
                orderId: order.id.id,
                productId: product.id.id
            })
        );

        await Promise.resolve(products)
    }

    async findOrder(id: string): Promise<Order> {
        const order = await OrderModel.findOne({
            where: {
                id
            },
            include: [
                {
                    model: ClientModel
                },
                {
                    model: ProductModel
                }
            ]
        });

        return new Order({
            id: new Id(order.id),
            client: new Client({
                id: new Id(order.client.id),
                address: order.client.street,
                email: order.client.email,
                name: order.client.name
            }),
            products: order.products.map((product) => new Product({
                id: new Id(product.id),
                description: product.description,
                name: product.name,
                salesPrice: product.salesPrice
            })),
            status: order.status
        })
    }

}