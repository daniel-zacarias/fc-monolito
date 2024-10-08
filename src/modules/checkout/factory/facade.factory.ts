import ClientAdmFacadeFactory from "../../client-adm/factory/facade.factory"
import InvoiceFacadeFactory from "../../invoice/factory/factory.facade";
import { PaymentFacadeFactory } from "../../payment/factory/facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade"
import { OrderRepository } from "../repository/order.repository"
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase"

export class CheckoutFacadeFactory {
    static create(): CheckoutFacade {
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
        return facade;
    }
}