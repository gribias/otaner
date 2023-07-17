import { IResourceComponentsProps } from "@refinedev/core";
import { MuiListInferencer } from "@refinedev/inferencer/mui";
import { List } from "@refinedev/mui";
import { Typography } from "@mui/material";
import Allproducts from "pages/allproducts"

export const ProductList: React.FC<IResourceComponentsProps> = () => {
  return (
    <>
    <Allproducts />
   
        </>
);
 
};


// return <MuiListInferencer
// title={<Typography variant="h5">Custom Title</Typography>}

// />;