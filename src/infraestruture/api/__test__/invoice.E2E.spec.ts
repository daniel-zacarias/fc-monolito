import { Umzug } from "umzug";
import { migrator } from "../../../migrations/config-migration/migrator";
import Address from "../../../modules/@shared/domain/value-object/address";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/factory.facade";

describe('E2E test for invoice', () => {
    let migration: Umzug<any>;
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            storage: ":memory:",
            logging: false,
            dialect: "sqlite"
        });
        sequelize.addModels([InvoiceItemModel, InvoiceModel])
        migration = migrator(sequelize)
        await migration.up()
    })

    afterEach(async () => {
        await migration.down()
        await sequelize.close()
    })


    it("Should checkout", async () => {
        const invoiceFacade = InvoiceFacadeFactory.create();

        const invoice = await invoiceFacade.create({
            city: "SP",
            complement: "Casa",
            document: "000",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100
                }
            ],
            name: "Nota 1",
            number: "20",
            state: "SP",
            street: "Rua",
            zipCode: "000"
        })

        const response = await request(app).get(`/invoice/${invoice.id}`)
        expect(response.status).toEqual(200);
        expect(response.body.id).toEqual(invoice.id);
        expect(response.body.document).toEqual("000");
        expect(response.body.name).toEqual("Nota 1");
        expect(response.body.address.street).toEqual("Rua");
        expect(response.body.address.number).toEqual("20");
        expect(response.body.address.zipCode).toEqual("000");
        expect(response.body.address.state).toEqual("SP");
        expect(response.body.address.complement).toEqual("Casa");
        expect(response.body.total).toEqual(100);
        expect(response.body.items[0].id).toEqual("1");
        expect(response.body.items[0].name).toEqual("Item 1");
        expect(response.body.items[0].price).toEqual(100);
    });

})