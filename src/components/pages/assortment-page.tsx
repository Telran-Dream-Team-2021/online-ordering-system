import React, {useEffect, useState} from 'react';
import {catalog} from "../../config/services-config";
import {ProductData} from "../../models/product-data";

const AssortmentPage = () => {
    const [catalogState, setCatalog] = useState<ProductData[]>([]);
    useEffect(() => {
        catalog.getAllProducts().subscribe({
            next(products) {
                setCatalog(products);
            }
        })
    })

    return (
        <div>
            <h1>AssortmentPage</h1>
            <div>
                {JSON.stringify(catalogState)}
            </div>
        </div>
    );
};

export default AssortmentPage;