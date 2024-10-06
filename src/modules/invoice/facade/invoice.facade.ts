import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import InvoiceFacadeInterface, { FindClientUseCaseInputDto, FindClientUseCaseOutputDto, GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    findUsecase: UseCaseInterface;
    generateUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _findUsecase: UseCaseInterface;
    private _generateUsecase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._findUsecase = props.findUsecase;
        this._generateUsecase = props.generateUsecase;
    }


    async create(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        return await this._generateUsecase.execute(input);
    }

    async find(input: FindClientUseCaseInputDto): Promise<FindClientUseCaseOutputDto> {
        return await this._findUsecase.execute(input);
    }
}