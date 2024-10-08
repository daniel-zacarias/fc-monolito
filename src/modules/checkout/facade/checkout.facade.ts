import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import CheckoutFacadeInterface, { CheckoutFacadeInputDto, CheckoutFacadeOutputDto } from "./checkout.facade.interface";


export interface UseCaseProps {
    placeOrderUseCase: UseCaseInterface;
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
    private _placeOrderUseCase: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._placeOrderUseCase = usecaseProps.placeOrderUseCase;
    }

    async checkout(input: CheckoutFacadeInputDto): Promise<CheckoutFacadeOutputDto> {
        return await this._placeOrderUseCase.execute(input);
    }

}