import AddProductUseCase from "./add-product.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    }
};

describe('Add Product usecase unit test', () => {
    it("Should add new product", async () => {
        const productRepository = MockRepository();
        const useCase = new AddProductUseCase(productRepository);

        const input = {
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        };

        const result = await useCase.execute(input);

        expect(productRepository.add).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(input.name)
        expect(result.description).toEqual(input.description)
        expect(result.purchasePrice).toEqual(input.purchasePrice)
        expect(result.stock).toEqual(input.stock)
    });
});