import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import ProductAdmFacadeInterface, { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./product-adm.interface.facade";

export interface UseCaseProps {
    addUseCase: UseCaseInterface;
    checkStockUseCase: UseCaseInterface;
};

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
    private _addUsecase: UseCaseInterface;
    private _checkStockUseCase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps) {
        this._addUsecase = useCaseProps.addUseCase;
        this._checkStockUseCase = useCaseProps.checkStockUseCase;
    }

    async addProduct(input: AddProductFacadeInputDto): Promise<void> {
        return await this._addUsecase.execute(input);
    }

    async checkStock(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto> {
        return await this._checkStockUseCase.execute(input);
    }
}