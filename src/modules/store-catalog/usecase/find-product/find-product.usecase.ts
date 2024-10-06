import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto";

export default class FindProductUseCase implements UseCaseInterface {
    private _productRepository: ProductGateway;

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository;
    }

    async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {
        const product = await this._productRepository.find(input.id);
        if (!product)
            throw new Error(`Product with id ${input.id} not found`)
        return {
            id: product.id.id,
            description: product.description,
            name: product.name,
            salesPrice: product.salesPrice
        }
    }
}