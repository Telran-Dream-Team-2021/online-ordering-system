export type ProductData = {
    productId: number | string,
    name: string,
    categoryName: string,
    description: string,
    imageUrl: string,
    price: number,
    unitOfMeasurement: string,
    isActive: boolean,
}

export const dummyProduct: ProductData = {
    productId: 0,
    name: "",
    categoryName: "",
    description: "",
    imageUrl: "",
    price: 0,
    unitOfMeasurement: "",
    isActive: false
}