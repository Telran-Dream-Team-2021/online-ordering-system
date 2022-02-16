import React from 'react';
import Button from '@mui/material/Button';

const SummaryCheckoutBlock = () => {
    return (
        <div style={{ height: 300, width: '100%', alignContent: "center" , justifyContent: "center"}}>
            <h2>TOTAL: XXXXX</h2>
            <p>Boston, Boylston st. 77</p>
            <Button size="large" variant="contained" style={{maxWidth: '150px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}}>
                ORDER
            </Button>
        </div>
    );
};

export default SummaryCheckoutBlock;