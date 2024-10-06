import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";

export class PaymentFacadeFactory {
    static create(): PaymentFacade {
        const repository = new TransactionRepository()
        const addUsecase = new ProcessPaymentUseCase(repository)
        return new PaymentFacade({
            save: addUsecase
        })
    }
}