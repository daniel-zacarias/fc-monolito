import StoreCatalogFacade from "../facade/storage-catalog.facade";
import StoreCatalogFacadeInterface from "../facade/storage-catalog.facade.interface";
import ProductRepository from "../repository/product.repository";
import FindAllProductUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";

export default class StoreCatalogFacadeFactory {
    static create(): StoreCatalogFacade {
        const productRepository = new ProductRepository();
        const findUseCase = new FindProductUseCase(productRepository);
        const findAllUseCase = new FindAllProductUseCase(productRepository);
        const facade = new StoreCatalogFacade({
            findAllUseCase: findAllUseCase,
            findUseCase: findUseCase
        });
        return facade;
    }
}