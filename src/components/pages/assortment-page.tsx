import React, {useEffect, useState} from 'react';
import {catalog} from "../../config/services-config";
import {ProductData} from "../../models/product-data";
import {useDispatch, useSelector} from "react-redux";
import {userDataSelector} from "../../redux/store";

const AssortmentPage = () => {
    const dispatch = useDispatch();
    const userData = useSelector(userDataSelector);
    // const assortment = useSelector

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