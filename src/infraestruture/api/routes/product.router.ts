import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { AddProductFacadeInputDto } from "../../../modules/product-adm/facade/product-adm.interface.facade";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const facade = ProductAdmFacadeFactory.create();
    try {
        const input: AddProductFacadeInputDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        };
        await facade.addProduct(input);
        console.log(input)
        res.status(201).send({ message: `Product has been created!` })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});