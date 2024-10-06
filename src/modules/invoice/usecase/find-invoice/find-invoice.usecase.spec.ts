import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
    id: new Id("1"),
    name: "invoice 1",
    address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
    ),
    document: "0000",
    items: [
        {
            id: new Id("1"),
            name: "",
            price: 100
        }
    ]
})

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
}

describe('FindInvoiceUseCase test', () => {
    it("Should be find an invoice", async () => {
        const repository = MockRepository();
        const useCase = new FindInvoiceUseCase(repository);

        const input = {
            id: "1"
        }

        const result = await useCase.execute(input);

        expect(result.id).toEqual(invoice.id.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.city).toEqual(invoice.address.city);
        expect(result.address.complement).toEqual(invoice.address.complement);
        expect(result.address.number).toEqual(invoice.address.number);
        expect(result.address.state).toEqual(invoice.address.state);
        expect(result.address.street).toEqual(invoice.address.street);
        expect(result.address.zipCode).toEqual(invoice.address.zipCode);
        expect(result.items).toHaveLength(1);
        expect(result.total).toEqual(100);
    });
})