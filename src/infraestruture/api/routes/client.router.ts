import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/facade.factory";
import { AddClientFacadeInputDto } from "../../../modules/client-adm/facade/client.adm.facade.interface";
import Address from "../../../modules/@shared/domain/value-object/address";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
    const facade = ClientAdmFacadeFactory.create();
    try {
        const address = new Address(
            req.body.address.street,
            req.body.address.number,
            req.body.address.complement,
            req.body.address.city,
            req.body.address.state,
            req.body.address.zipcode
        )
        const input: AddClientFacadeInputDto = {
            name: req.body.name,
            address: address,
            document: req.body.document,
            email: req.body.email
        }
        await facade.add(input);
        res.status(201).send({ message: `Client has been created!` })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
