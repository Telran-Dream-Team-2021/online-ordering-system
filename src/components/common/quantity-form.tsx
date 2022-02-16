import {FC, useState} from "react";
import * as React from "react";
import {Button, ButtonGroup, TextField} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {ItemData} from "../../models/item-data";

const Quantity: FC<{item: ItemData, setItemsStateFn: ()=>void}> = (props)=>{
    const {item, setItemsStateFn} = props
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        item.quantity = isNaN(parseInt(event.target.value))?0: parseInt(event.target.value)
        setItemsStateFn()
    };
    return <ButtonGroup>
        <Button
            aria-label="reduce"
            onClick={() => {
                item.quantity = Math.max(item.quantity - 1, 0)
                setItemsStateFn()
            }}
        >
            <RemoveIcon fontSize="small" />
        </Button>
        <TextField
            id="outlined-number"
            value={item.quantity}
            variant="standard"
            onChange={handleChange}
            InputLabelProps={{
                shrink: true,
            }}
        />
        <Button
            aria-label="increase"
            onClick={() => {
                item.quantity = item.quantity + 1
                setItemsStateFn()
            }}
        >
            <AddIcon fontSize="small" />
        </Button>
    </ButtonGroup>

}

export default Quantity