import { Sequelize } from "sequelize-typescript"
import Client from "../domain/client.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import { ClientModel } from "../../client-adm/repository/client.model"
import OrderModel from "./order.model"
import OrderProductModel from "./order-product.model"
import { OrderRepository } from "./order.repository"
import Order from "../domain/order.entity"
import Product from "../domain/product.entity"
import ProductModel from "../../store-catalog/repository/product.model"

const mockDate = new Date(2000, 1, 1);

describe("Order Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })
        jest.useFakeTimers("modern");
        jest.setSystemTime(mockDate);

        sequelize.addModels([ClientModel, ProductModel, OrderModel, OrderProductModel])
        await sequelize.sync({ force: true })
    })

    afterEach(async () => {
        jest.useRealTimers();
        await sequelize.close()
    })

    it("should create an order", async () => {
        await ClientModel.create({
            id: '1',
            name: 'Lucian',
            email: 'lucian@123.com',
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipcode: "88888-888",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const repository = new OrderRepository();
        const input = new Order({
            id: new Id(),
            client: new Client({
                id: new Id("1"),
                address: "Rua 123",
                email: "lucian@123.com",
                name: "Lucian"
            }),
            products: [
                new Product({
                    id: new Id("1"),
                    description: "Description 1",
                    name: "Product 1",
                    salesPrice: 100
                })
            ],
            status: "approved"
        });
        await repository.addOrder(input);

        const order = await OrderModel.findOne({
            where: {
                id: input.id.id
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

        expect(order.id).toBe(input.id.id)
        expect(order.products[0].id).toBe(input.products[0].id.id)
        expect(order.products[0].name).toBe(input.products[0].name)
        expect(order.products[0].description).toBe(input.products[0].description)
        expect(order.products[0].salesPrice).toBe(input.products[0].salesPrice)
        expect(order.client.id).toBe(input.client.id.id)
        expect(order.client.name).toBe(input.client.name)
        expect(order.client.street).toBe(input.client.address)
        expect(order.client.email).toBe(input.client.email)
        expect(order.status).toBe(input.status)
    })

    it("should find an order", async () => {
        await ClientModel.create({
            id: '1',
            name: 'Lucian',
            email: 'lucian@123.com',
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipcode: "88888-888",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const repository = new OrderRepository();

        await OrderModel.create({
            id: "1",
            clientId: "1",
            status: "approved",
        });

        await OrderProductModel.create({
            orderId: "1",
            productId: "1"
        });

        const order = await repository.findOrder("1");




        expect(order.id.id).toBe("1")
        expect(order.products[0].id.id).toBe("1")
        expect(order.products[0].name).toBe("Product 1")
        expect(order.products[0].description).toBe("Description 1")
        expect(order.products[0].salesPrice).toBe(100)
        expect(order.client.id.id).toBe("1")
        expect(order.client.name).toBe("Lucian")
        expect(order.client.address).toBe("Rua 123")
        expect(order.client.email).toBe("lucian@123.com")
        expect(order.status).toBe("approved")
    })
})