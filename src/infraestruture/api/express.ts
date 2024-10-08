import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../migrations/config-migration/migrator";
import ProductModelRegistration from "../../modules/product-adm/repository/product.model";
import ProductModel from "../../modules/store-catalog/repository/product.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import { clientRoute } from "./routes/client.router";
import { productRoute } from "./routes/product.router";
import { invoiceRoute } from "./routes/invoice.router";
import OrderProductModel from "../../modules/checkout/repository/order-product.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import { checkoutRoute } from "./routes/checkout.router";
import TransactionModel from "../../modules/payment/repository/transaction.model";
export const app: Express = express();

app.use(express.json());
app.use("/client", clientRoute);
app.use("/product", productRoute);
app.use("/invoice", invoiceRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;

let migration: Umzug<any>;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "database.sqlite",
        logging: false
    });
    sequelize.addModels([ProductModelRegistration, ProductModel, ClientModel, InvoiceModel, InvoiceItemModel, OrderModel, OrderProductModel, TransactionModel]);
    migration = migrator(sequelize)
    await migration.up()
}
setupDb()