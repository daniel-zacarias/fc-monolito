import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

// const invoice = new Invoice({
//     id: new Id("1"),
//     name: "invoice 1",
//     address: new Address(
//         "Rua 123",
//         "99",
//         "Casa Verde",
//         "Criciúma",
//         "SC",
//         "88888-888",
//     ),
//     document: "0000",
//     items: [
//         {
//             id: new Id("1"),
//             name: "",
//             price: 100
//         }
//     ]
// })

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    }
}

describe('FindInvoiceUseCase test', () => {
    it("Should be find an invoice", async () => {
        const repository = MockRepository();
        const useCase = new GenerateInvoiceUseCase(repository);

        const input = {
            name: "invoice 1",
            document: "0000",
            street: "Rua",
            number: "0000",
            complement: "casa",
            city: "São Paulo",
            state: "SP",
            zipCode: "000000",
            items: [{
                id: "1",
                name: "Nome 1",
                price: 100,
            }]
        }

        const result = await useCase.execute(input);

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.city).toEqual(input.city);
        expect(result.complement).toEqual(input.complement);
        expect(result.number).toEqual(input.number);
        expect(result.state).toEqual(input.state);
        expect(result.street).toEqual(input.street);
        expect(result.zipCode).toEqual(input.zipCode);
        expect(result.items).toHaveLength(1);
    });
})