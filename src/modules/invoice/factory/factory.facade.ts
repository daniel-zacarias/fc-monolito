import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
    static create() {
        const repository = new InvoiceRepository();
        const addUsecase = new FindInvoiceUseCase(repository);
        const findUseCase = new GenerateInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateUsecase: addUsecase,
            findUsecase: findUseCase
        });
        return facade;
    }
}