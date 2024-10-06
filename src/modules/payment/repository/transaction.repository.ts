import Transaction from "../domain/transactional.entity";
import PaymentGateway from "../gateway/paymeny.gateway";
import TransactionModel from "./transaction.model";

export default class TransactionRepository implements PaymentGateway {
    async save(input: Transaction): Promise<Transaction> {
        await TransactionModel.create({
            id: input.id.id,
            orderId: input.orderId,
            amount: input.amount,
            status: input.status,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        });

        return new Transaction({
            id: input.id,
            orderId: input.orderId,
            amount: input.amount,
            status: input.status,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        });
    }
}