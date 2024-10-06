import { string } from "yup";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../@shared/domain/value-object/address";

const mockDate = new Date(2000, 1, 1);

describe('PlaceOrderUseCase unit test', () => {
    describe('ValidateProducts method', () => {
        it("Should throw an error when product was not valid", async () => {
            const mockClientFacade = {
                add: jest.fn(),
                find: jest.fn().mockResolvedValue(true)
            };
            //@ts-expect-error - no params on constructors;
            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade);
            const mockValidatedProduct = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - no return never
                .mockRejectedValue(new Error("No products selected"));
            const input: PlaceOrderInputDto = { clientId: "1", products: [] }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("No products selected")
            );
            expect(mockValidatedProduct).toHaveBeenCalledTimes(1);
        });

        it("Should throw an error when product is out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({ productId }: { productId: string }) => Promise.resolve({
                    productId,
                    stock: productId === "1" ? 0 : 1
                }))
            };


            //@ts-expect-error - no params on constructors;
            const placeOrderUseCase = new PlaceOrderUseCase(null, mockProductFacade);
            let input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "1" }]
            }

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );

            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }]
            }

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);
        });
    });

    describe('GetProducts method', () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        //@ts-expect-error - no params on constructors;
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("Should throw an error when product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null)
            }

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
                new Error("Product not found")
            );
        });

        it("Should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "Product 0 Description",
                    salesPrice: 0
                })
            }

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            expect(await placeOrderUseCase["getProduct"]("0")).toEqual(new Product({
                id: new Id("0"),
                name: "Product 0",
                description: "Product 0 Description",
                salesPrice: 0
            }));

            expect(mockCatalogFacade.find).toBeCalledTimes(1);
        });
    });

    describe('Execute method', () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        describe('Place an order', () => {
            const clientProps = {
                id: "1c",
                name: "Client 0",
                document: "0000",
                email: "client@user.com",
                address: new Address("some adress",
                    "1",
                    "",
                    "some city",
                    "some state",
                    "000")
            };

            const mockClientFacade = {
                add: jest.fn(),
                find: jest.fn().mockResolvedValue(clientProps)
            }

            const mockPaymentFacade = {
                process: jest.fn()
            }

            const mockCheckouRepo = {
                addOrder: jest.fn(),
                findOrder: jest.fn()
            }

            const mockInvoiceFacade = {
                create: jest.fn().mockResolvedValue({ id: "1i" }),
                find: jest.fn()
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade,
                null,
                null,
                mockCheckouRepo,
                mockInvoiceFacade,
                mockPaymentFacade
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "some description",
                    salesPrice: 40
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "some description",
                    salesPrice: 30
                }),
            };

            const mockValidatedProduct = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - spy on private method
                .mockResolvedValue(null);

            const mockGetProduct = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "getProduct")
                //@ts-expect-error - spy on private method
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId]
                });

            it("Should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{ productId: "1", }, { productId: "2" }]
                };

                const output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "1" },
                    { productId: "2" }
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toBeCalledWith({ id: "1c" });
                expect(mockValidatedProduct).toHaveBeenCalledTimes(1);
                expect(mockValidatedProduct).toHaveBeenCalledWith(input);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckouRepo.addOrder).toHaveBeenCalledTimes
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });

                expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(0);
            });

            it("Should be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{ productId: "1", }, { productId: "2" }]
                };

                const output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe("1i");
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "1" },
                    { productId: "2" }
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toBeCalledWith({ id: "1c" });
                expect(mockValidatedProduct).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckouRepo.addOrder).toHaveBeenCalledTimes(1)
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });
                expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.create).toHaveBeenCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.address.street,
                    number: clientProps.address.number,
                    complement: clientProps.address.complement,
                    city: clientProps.address.city,
                    state: clientProps.address.state,
                    zipCode: clientProps.address.zipCode,
                    items: [
                        {
                            id: products["1"].id.id,
                            name: products["1"].name,
                            price: products["1"].salesPrice
                        },
                        {
                            id: products["2"].id.id,
                            name: products["2"].name,
                            price: products["2"].salesPrice
                        },
                    ]
                })
            });
        });


    });
});