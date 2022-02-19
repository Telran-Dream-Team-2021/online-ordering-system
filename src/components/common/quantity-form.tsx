import {FC, useState} from "react";
import * as React from "react";
import {Button, ButtonGroup, TextField, InputBase} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {ItemData} from "../../models/item-data";
import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles({
    noBorder:{
        border: 'none',
        outline: 'none',
        '&hover':{
            border: 'none',
            outline: 'none'
        }
    },
    inputBorder:{
        textAlign: 'center'
    }
})

const Quantity: FC<{item: ItemData, setItemsStateFn: ()=>void}> = (props)=>{
    const {item, setItemsStateFn} = props
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        item.quantity = isNaN(parseInt(event.target.value))?0: parseInt(event.target.value)
        setItemsStateFn()
    }
    const classes = useStyles()
    return <ButtonGroup>
        <Button
            className={classes.noBorder}
            aria-label="reduce"
            style={{ border: 'none' }}
            onClick={() => {
                item.quantity = Math.max(item.quantity - 1, 0)
                setItemsStateFn()
            }}
        >
            <RemoveIcon fontSize="small" />
        </Button>
        <InputBase
            sx={{ border: '1px solid #eaeaea', borderRadius: '5px', textAlign: 'center', paddingLeft: '10' }}

            value={item.quantity}
            onChange={handleChange}

        />
        <Button
            // className={classes.noBorder}
            aria-label="increase"
            style={{ border: 'none' }}
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