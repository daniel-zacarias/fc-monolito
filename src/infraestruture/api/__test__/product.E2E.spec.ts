import { Umzug } from "umzug";
import { migrator } from "../../../migrations/config-migration/migrator";
import { app, sequelize } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../modules/store-catalog/repository/product.model";

describe('E2E test for product', () => {
    let migration: Umzug<any>;
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        });
        sequelize.addModels([ProductModel]);
        migration = migrator(sequelize);
        await migration.down();
        await migration.up();
    });

    afterAll(async () => {
        await sequelize.close()
    });

    it("Should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Product 1",
                description: "Description 1",
                purchasePrice: 100,
                stock: 1
            })
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual("Product has been created!");

    });

    it("Should not create product", async () => {
        const response = await request(app)
            .post("/products")
        expect(response.status).toEqual(500);

    })

})