import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";

describe('Invoice repository test', () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("Should create an invoice", async () => {
        const repository = new InvoiceRepository()
        const input = new Invoice(
            {
                id: new Id("1"),
                name: "invoice 1",
                document: "0000",
                address: new Address(
                    "Rua",
                    "0000",
                    "casa",
                    "São Paulo",
                    "SP",
                    "000000"),
                items: [{
                    id: new Id("1"),
                    name: "Nome 1",
                    price: 100,
                }]
            });

        await repository.add(input);
        const output = await InvoiceModel.findOne({
            where: { id: 1 }, include: [{
                model: InvoiceItemModel
            }]
        });

        expect(output.id).toEqual(input.id.id);
        expect(output.name).toEqual(input.name);
        expect(output.document).toEqual(input.document);
        expect(output.complement).toEqual(input.address.complement);
        expect(output.city).toEqual(input.address.city);
        expect(output.zipcode).toEqual(input.address.zipCode);
        expect(output.state).toEqual(input.address.state);
        expect(output.street).toEqual(input.address.street);
        expect(output.number).toEqual(input.address.number);
        expect(output.items[0].id).toEqual(input.items[0].id.id);
        expect(output.items[0].name).toEqual(input.items[0].name);
        expect(output.items[0].price).toEqual(input.items[0].price);



    });

    it("Should find an invoice", async () => {
        await InvoiceModel.create({
            id: "1",
            name: "invoice 1",
            document: "0000",
            street: "Rua",
            number: "0000",
            complement: "Casa",
            city: "São Paulo",
            zipcode: "0000",
            state: "SP",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await InvoiceItemModel.create({
            id: "1",
            name: "Item 1",
            price: 100,
            invoiceId: "1"
        });
        const repository = new InvoiceRepository()

        const output = await repository.find("1");

        expect(output.id.id).toEqual("1");
        expect(output.name).toEqual("invoice 1");
        expect(output.document).toEqual("0000");
        expect(output.address.complement).toEqual("Casa");
        expect(output.address.city).toEqual("São Paulo");
        expect(output.address.zipCode).toEqual("0000");
        expect(output.address.state).toEqual("SP");
        expect(output.address.street).toEqual("Rua");
        expect(output.address.number).toEqual("0000");
        expect(output.items[0].id.id).toEqual("1");
        expect(output.items[0].name).toEqual("Item 1");
        expect(output.items[0].price).toEqual(100);

    });
});