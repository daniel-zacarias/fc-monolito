import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";

export default class InvoiceRepository implements InvoiceGateway {
    async add(invoice: Invoice): Promise<void> {
        InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            complement: invoice.address.complement,
            number: invoice.address.number,
            city: invoice.address.city,
            state: invoice.address.state,
            zipcode: invoice.address.zipCode,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const invoiceItems = invoice.items.map((item) => {
            InvoiceItemModel.create({
                id: item.id.id,
                name: item.name,
                price: item.price,
                invoiceId: invoice.id.id
            })
        });

        await Promise.resolve(invoiceItems);
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id },
            include: [
                { model: InvoiceItemModel }
            ]
        });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        return new Invoice({
            id: new Id(invoice.id),
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipcode
            ),
            items: invoice.items.map((item) => ({
                id: new Id(item.id),
                name: item.name,
                price: item.price
            })),
            document: invoice.document,
            name: invoice.name,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        })
    }
}

