import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductsDto } from "./find-all-products.dto";

export default class FindAllProductUseCase implements UseCaseInterface {
    private _productRepository: ProductGateway;

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository;
    }
    async execute(): Promise<FindAllProductsDto> {
        const products = await this._productRepository.findAll();
        return {
            products: products.map((product) => ({
                id: product.id.id,
                description: product.description,
                name: product.name,
                salesPrice: product.salesPrice
            }))
        }
    }
}