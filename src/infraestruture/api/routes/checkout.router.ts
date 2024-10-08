import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/facade.factory";
import { AddClientFacadeInputDto } from "../../../modules/client-adm/facade/client.adm.facade.interface";
import Address from "../../../modules/@shared/domain/value-object/address";
import { PaymentFacadeFactory } from "../../../modules/payment/factory/facade.factory";
import { CheckoutFacadeFactory } from "../../../modules/checkout/factory/facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
    const facade = CheckoutFacadeFactory.create();
    try {
        const output = await facade.checkout({
            clientId: req.body.clientId,
            products: req.body.products
        });
        res.status(200).send(output);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
