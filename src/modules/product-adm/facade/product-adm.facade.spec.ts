import { Sequelize } from "sequelize-typescript";
import ProductModelRegistration from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductAdmFacadeFactory from "../factory/facade.factory";

describe('ProductAdmFacade test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([ProductModelRegistration]);
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    });

    it("Should create a product", async () => {
        const productFacade = ProductAdmFacadeFactory.create()

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        }

        await productFacade.addProduct(input);

        const productDb = await ProductModelRegistration.findOne({ where: { id: input.id } });

        expect(productDb).toBeDefined()
        expect(input.id).toEqual(productDb.id);
        expect(input.name).toEqual(productDb.name);
        expect(input.description).toEqual(productDb.description);
        expect(input.purchasePrice).toEqual(productDb.purchasePrice);
        expect(input.stock).toEqual(productDb.stock);

    });

    it("should check product stock", async () => {
        const productFacade = ProductAdmFacadeFactory.create();
        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 10,
            stock: 10,
        };
        await productFacade.addProduct(input);

        const result = await productFacade.checkStock({ productId: "1" });

        expect(result.productId).toBe(input.id);
        expect(result.stock).toBe(input.stock);
    });
})