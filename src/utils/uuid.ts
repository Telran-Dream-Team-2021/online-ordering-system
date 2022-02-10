import { v4 as uuid } from "uuid";
export const getUuidByUser: ()=>string = () =>{
    return `U-${uuid().split('-')[0]}`
}
export const getUuidByOrder: ()=>string = () =>{
    return `O-${uuid().split('-')[0]}`
}
export const getUuidByProduct: ()=>string = () =>{
    return `P-${uuid().split('-')[0]}`
}