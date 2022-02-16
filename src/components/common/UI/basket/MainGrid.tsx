import React from 'react';
import {DataGrid, GridColumns, GridRowsProp, GridActionsCellItem, GridRowParams, GridColDef} from "@mui/x-data-grid";
const MainGrid = () => {
    const rows: GridRowsProp = [
        { id: 1, col1: 'Hello', col2: '3', col3: 1000 },
        { id: 2, col1: 'DataGridPro', col2: '3', col3: 1000 },
        { id: 3, col1: 'MUI', col2: '2', col3: 1000 },
    ];

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Product', width: 150 },
        { field: 'col2', headerName: 'Qty', width: 150 },
        { field: 'col3', headerName: 'Price', width: 150 },
    ];

    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} checkboxSelection pageSize={5}/>
        </div>
    );
};

export default MainGrid;