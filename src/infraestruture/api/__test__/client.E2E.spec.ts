import { Umzug } from "umzug";
import { migrator } from "../../../migrations/config-migration/migrator";
import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";

describe('E2E test for customer', () => {
    let migration: Umzug<any>;

    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        });
        sequelize.addModels([ClientModel]);
        migration = migrator(sequelize);
        await migration.down();
        await migration.up();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("Should create customer", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                name: "John",
                address: {
                    street: "Street",
                    city: "City",
                    number: "123",
                    zipcode: "12345",
                    complement: "casa",
                    state: "SP"
                },
                "document": "00000",
                "email": "john@email.com"
            })
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual("Client has been created!");

    });

    it("Should not create customer", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                name: "John"
            })
        expect(response.status).toEqual(500);

    })

})