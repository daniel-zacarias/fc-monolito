import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductUseCase from "./find-all-products.usecase";

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Description 1",
    salesPrice: 100
});

const product2 = new Product({
    id: new Id("2"),
    name: "Product 2",
    description: "Description 2",
    salesPrice: 100
});

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2]))
    }
}

describe('FindAllProducts tests', () => {
    it("Should find all products", async () => {
        const productRepository = MockRepository();
        const usecase = new FindAllProductUseCase(productRepository);

        const result = await usecase.execute();
        expect(productRepository.findAll).toHaveBeenCalled();
        expect(result.products).toHaveLength(2);
        expect(result.products[0].id).toEqual("1");
        expect(result.products[0].name).toEqual("Product 1");
        expect(result.products[0].description).toEqual("Description 1");
        expect(result.products[0].salesPrice).toEqual(100);
        expect(result.products[1].id).toEqual("2");
        expect(result.products[1].name).toEqual("Product 2");
        expect(result.products[1].description).toEqual("Description 2");
        expect(result.products[1].salesPrice).toEqual(100);
    });
});