import { Umzug } from "umzug";
import { migrator } from "../../../migrations/config-migration/migrator";
import Address from "../../../modules/@shared/domain/value-object/address";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { app } from "../express";
import request from "supertest";
import ProductModel from "../../../modules/store-catalog/repository/product.model";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
import ProductModelRegistration from "../../../modules/product-adm/repository/product.model";
import OrderProductModel from "../../../modules/checkout/repository/order-product.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";

describe('E2E test for checkout', () => {
    let migration: Umzug<any>;
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            storage: ":memory:",
            logging: false,
            dialect: "sqlite"
        });
        sequelize.addModels([OrderProductModel, ProductModelRegistration, ProductModel, ClientModel, TransactionModel, OrderModel, InvoiceItemModel, InvoiceModel])
        migration = migrator(sequelize)
        await migration.up()
    })

    afterEach(async () => {
        await migration.down()
        await sequelize.close()
    })


    it("Should checkout", async () => {
        const clientFacade = ClientAdmFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();

        await clientFacade.add({
            id: "1",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            ),
            document: "000",
            email: "email@email.com",
            name: "John"
        });

        await productFacade.addProduct({
            id: "1",
            description: "Description 1",
            name: "Product 1",
            purchasePrice: 100,
            stock: 1
        });
        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: "1",
                products: [
                    {
                        productId: "1"
                    }
                ],
                purchasePrice: 100,
                stock: 1
            })
        expect(response.status).toEqual(200);
        expect(response.body.invoiceId).toBeDefined();

    });

})