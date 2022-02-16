import React from 'react';
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {BasketData} from "../../../../models/basket-data";
import {useDispatch, useSelector} from "react-redux";
import {basketSelector, catalogSelector, userDataSelector} from "../../../../redux/store";
import {UserData} from "../../../../models/common/user-data";
import {basket} from "../../../../config/services-config";
import {setBasket} from "../../../../redux/actions";
import {ProductData} from "../../../../models/product-data";

const MainGrid = () => {

    const basketData: BasketData = useSelector(basketSelector);
    const userData: UserData = useSelector(userDataSelector);
    // const productData: ProductData[] = useSelector(catalogSelector);
    const dispatch = useDispatch();

    function getBasketInfo(): string[] {
        const userBasket = basket.getBasket(userData.username);
        const qty = userBasket.forEach((i)=>i.basketItems.filter((i)=> i.quantity));
        const productId = userBasket.forEach((i)=>i.basketItems.filter((i)=> i.productId));
        const pricePerUnit = userBasket.forEach((i)=>i.basketItems.filter((i)=> i.pricePerUnit));
        console.log(qty.then())
        console.log(productId.then())
        console.log(pricePerUnit.then())
        return [
            `Product: ${productId}`,
            `Quantity: ${qty}`,
            `Price: ${pricePerUnit}`
        ];
    }

    console.log(getBasketInfo());

    function removeFromCart() {
        // dispatch(removeBasketItemAction(basketData, 444));
        const res = basket.removeItem(basketData, 444);
        return res.then((bd) => {
            dispatch(setBasket({...bd}));
        })
    }

    const product: ProductData = {
        categoryName: "Test",
        description: "Test",
        imageUrl: "http://localhost",
        isActive: false,
        name: "Gavr7",
        price: 7770,
        productId: 444,
        unitOfMeasurement: "kg"
    };

    function addToCart() {
        console.log("startAdd", basketData);

        if (!basketData.userId) {
            basketData.userId = userData.username;
        }
        const res = basket.addItem(basketData, product);
        return res.then((bd) => {
            // console.log(bd);
            dispatch(setBasket({...bd}));
        })
        // dispatch(addBasketItemAction(basketData, product));
    }

    const rows: GridRowsProp = [
        { id: 1, col1: "test", col2: '3', col3: 1000 },
        { id: 2, col1: 'DataGridPro', col2: '3', col3: 1000 },
        { id: 3, col1: 'MUI', col2: '2', col3: 1000 },
    ];

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Product', width: 200 },
        { field: 'col2', headerName: 'Qty', width: 200 },
        { field: 'col3', headerName: 'Price', width: 200 },
    ];

    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5}/>
        </div>
    );
};

export default MainGrid;