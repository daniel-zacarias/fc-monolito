import Transaction from "../domain/transactional.entity";

export default interface PaymentGateway {
    save(input: Transaction): Promise<Transaction>;
}