import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import PaymentFacade from "./payment.facade";
import { PaymentFacadeFactory } from "../factory/facade.factory";

describe("Payment Facade test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([TransactionModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a transaction", async () => {
        const facade = PaymentFacadeFactory.create();
        const input = {
            orderId: "1",
            amount: 100,
        };

        const result = await facade.process(input);

        expect(result.transactionId).toBeDefined();
        expect(result.status).toBe("approved");
        expect(result.amount).toBe(100);
        expect(result.orderId).toBe("1");
    })
});