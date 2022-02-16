import React from 'react';
import {Outlet} from "react-router-dom";

const CatalogPage = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default CatalogPage;