import express, { Request, Response } from "express";
import Address from "../../../modules/@shared/domain/value-object/address";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/factory.facade";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
    const facade = InvoiceFacadeFactory.create();
    try {
        const output = await facade.find({
            id: req.params.id
        });
        res.send(output);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
