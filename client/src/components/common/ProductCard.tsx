import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { Link } from "react-router-dom";
import {
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    Stack,
    Button,
    TextField
} from "@mui/material";

import { PropertyCardProps } from "interfaces/property";
import CartContext from "../../contexts/Cart/CartContext";

import React, { useContext, useState } from "react";



const ProductCard = ({
    id,
    reference,
    material,
    cost,
    photo,

}: PropertyCardProps) => {
    const [amount, setAmount] = useState(0);
    //@ts-ignore
    
    const { addToCart, increase, cartItems, sumItems, itemCount } = useContext(CartContext);
    
    const [size, setSize] = useState("");
      //Check whether the product is in the cart or not
       //@ts-ignore
  const isInCart = (product) => {
     //@ts-ignore
     return !!cartItems.find((item) => item.id === product.id && item.size === product.size);
  };


    return (
      <Card
        sx={{
          maxWidth: "330px",
          padding: "10px",
          "&:hover": {
            boxShadow: "0 22px 45px 2px rgba(176, 176, 176, 0.1)",
          },
          cursor: "pointer",
          textDecoration: "none",
        }}
        elevation={0}
      >
        <Link to={`/products/show/${id}`}>
          <CardMedia
            component="img"
            width="100%"
            height={210}
            image={photo}
            alt="card image"
            sx={{ borderRadius: "10px" }}
          />
        </Link>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "10px",
            paddingX: "5px",
          }}
        >
          <Stack direction="column" gap={1}>
            <Typography fontSize={16} fontWeight={500} color="#11142d">
              {reference}
            </Typography>
            <Stack direction="row" gap={0.5} alignItems="flex-start">
              <WidgetsRoundedIcon
                sx={{
                  fontSize: 18,
                  color: "#11142d",
                  marginTop: 0.5,
                }}
              />
                <Typography fontSize={14} color="#808191">
                {Object.entries(material).map(([type, value]) => (
  <span key={type}>
    {type}: {`${value.grams} gr `} 
  </span>
))}
            </Typography>

              {/* <Typography fontSize={14} color="#808191">
                            {grams} gramas
                        </Typography> */}
            </Stack>
          </Stack>
          <Box
            px={1.5}
            py={0.5}
            borderRadius={1}
            bgcolor="#dadefa"
            height="fit-content"
          >
            <Typography fontSize={12} fontWeight={600} color="#475be8">
              €{cost}
            </Typography>
          </Box>
        </CardContent>
        <Stack
          direction="row"
          gap={1}
          alignItems="flex-end"
          sx={{ ml: "auto" }}
        >
          {/* <NumberInput value={amount} setValue={setAmount}  /> */}
          <TextField
            label="tamanho"
            variant="outlined"
            size="small"
            type="number"
            inputProps={{ min: 3, max: 36 }}
            value={size}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setSize(e.target.value)}
          />
          {isInCart({ id, reference, material, cost, photo, size }) && (
            <Button
              onClick={() => {
                increase({ id, reference, material, cost, photo, size });
              }}
              variant="outlined"
              size="small"
            >
              +1
            </Button>
          )}
          {!isInCart({ id, reference, material, cost, photo, size }) && (
            <Button
              onClick={() => {
                addToCart({
                  id,
                  reference,
                  material,
                  cost,
                  photo,
                  size,
                  amount,
                });
                setAmount(0);
              }}
              variant="contained"
              size="small"
              startIcon={<AddShoppingCartOutlinedIcon />}
            >
              Encomendar
            </Button>
          )}
        </Stack>
      </Card>
    );
            };
            
            export default ProductCard;