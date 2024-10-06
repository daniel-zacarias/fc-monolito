import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDto, PaymentFacadeOutputDto } from "./payment.facade.interface";

export interface UseCaseProps {
    save: UseCaseInterface
}

export default class PaymentFacade implements PaymentFacadeInterface {
    private _saveUseCase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._saveUseCase = props.save
    }

    process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
        return this._saveUseCase.execute(input)
    }
} 