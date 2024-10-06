export interface PlaceOrderInputDto {
    clientId: string;
    products: {
        productId: string;
    }[];
}

export interface PlaceOrderOutputDto {
    id: string;
    total: number;
    invoiceId: string;
    products: {
        productId: string;
    }[];
}