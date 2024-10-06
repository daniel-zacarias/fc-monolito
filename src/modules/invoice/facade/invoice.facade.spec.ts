import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import Id from "../../@shared/domain/value-object/id.value-object";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";

describe('Invoice Facade Test', () => {
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
    });

    afterEach(async () => {
        await sequelize.close()
    });

    it("Should generate an invoice", async () => {
        const repository = new InvoiceRepository();
        const useCase = new GenerateInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateUsecase: useCase,
            findUsecase: undefined
        });

        const props = {
            name: "invoice 1",
            document: "0000",
            city: "City",
            complement: "Casa",
            number: "000",
            state: "SP",
            street: "Rua",
            zipCode: "000",
            items: [{
                id: "1",
                name: "Item 1",
                price: 100
            }],
        }

        const output = await facade.create(props);
        expect(output.id).toBeDefined();
        expect(output.name).toEqual(props.name);
        expect(output.document).toEqual(props.document);
        expect(output.complement).toEqual(props.complement);
        expect(output.city).toEqual(props.city);
        expect(output.zipCode).toEqual(props.zipCode);
        expect(output.state).toEqual(props.state);
        expect(output.street).toEqual(props.street);
        expect(output.number).toEqual(props.number);
        expect(output.items[0].id).toEqual(props.items[0].id);
        expect(output.items[0].name).toEqual(props.items[0].name);
        expect(output.items[0].price).toEqual(props.items[0].price);
        expect(output.total).toEqual(100);
    });

    it("Should find an invoice", async () => {
        const repository = new InvoiceRepository();
        const useCase = new FindInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateUsecase: undefined,
            findUsecase: useCase
        });

        const input = {
            id: "1",
            name: "invoice 1",
            document: "0000",
            city: "City",
            complement: "Casa",
            number: "000",
            state: "SP",
            street: "Rua",
            zipCode: "000",
        }

        await InvoiceModel.create({
            id: input.id,
            name: input.name,
            document: input.document,
            city: input.city,
            complement: input.complement,
            number: input.number,
            state: input.state,
            street: input.street,
            zipcode: input.zipCode,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await InvoiceItemModel.create({
            id: "1",
            name: "Item 1",
            price: 100,
            invoiceId: "1"
        });

        const output = await facade.find({
            id: "1"
        });
        expect(output.id).toBeDefined();
        expect(output.name).toEqual(input.name);
        expect(output.document).toEqual(input.document);
        expect(output.address.complement).toEqual(input.complement);
        expect(output.address.city).toEqual(input.city);
        expect(output.address.zipCode).toEqual(input.zipCode);
        expect(output.address.state).toEqual(input.state);
        expect(output.address.street).toEqual(input.street);
        expect(output.address.number).toEqual(input.number);
    });
});