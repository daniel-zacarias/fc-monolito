import { Sequelize } from "sequelize-typescript"
import { ClientModel } from "../../client-adm/repository/client.model"
import OrderModel from "../repository/order.model"
import OrderProductModel from "../repository/order-product.model"
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase"
import ClientAdmFacadeFactory from "../../client-adm/factory/facade.factory"
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory"
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory"
import { OrderRepository } from "../repository/order.repository"
import InvoiceFacadeFactory from "../../invoice/factory/factory.facade"
import { PaymentFacadeFactory } from "../../payment/factory/facade.factory"
import CheckoutFacade from "./checkout.facade"
import ProductModelRegistration from "../../product-adm/repository/product.model"
import InvoiceItemModel from "../../invoice/repository/invoice-item.model"
import InvoiceModel from "../../invoice/repository/invoice.model"
import ProductModel from "../../store-catalog/repository/product.model"
import { migrator } from "../../../migrations/config-migration/migrator"
import { Umzug } from "umzug"
import TransactionModel from "../../payment/repository/transaction.model"


describe("Product Facade test", () => {

    let sequelize: Sequelize;

    let migration: Umzug<any>;

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

    it("should checkout", async () => {
        const clientFacade = ClientAdmFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();
        const storageFacade = StoreCatalogFacadeFactory.create();
        const repository = new OrderRepository();
        const invoiceFacade = InvoiceFacadeFactory.create();
        const paymentFacade = PaymentFacadeFactory.create();
        const usecase = new PlaceOrderUseCase(clientFacade, productFacade, storageFacade, repository, invoiceFacade, paymentFacade);
        const facade = new CheckoutFacade({
            placeOrderUseCase: usecase
        });

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


        await productFacade.addProduct({
            id: "1",
            description: "Description 1",
            name: "Product 1",
            purchasePrice: 100,
            stock: 1
        })

        const output = await facade.checkout({
            clientId: "1",
            products: [
                {
                    productId: "1"
                }
            ]
        });

        expect(output.id).toBeDefined();
        expect(output.invoiceId).toBeDefined();
        expect(output.total).toEqual(110);
        expect(output.invoiceId).not.toBeNull();
        expect(output.products[0].productId).toEqual("1");
    })

})