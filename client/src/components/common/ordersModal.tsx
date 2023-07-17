import {
  Modal,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  useMediaQuery,
  Theme,
  IconButton,
  TextField, // Add the TextField component from Material-UI
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from "@mui/icons-material/Close";
import CartContext from "contexts/Cart/CartContext";
import React, { useContext, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
const ItemCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
}));

const ItemImage = styled("img")({
  width: "80px",
  height: "80px",
  borderRadius: "8px",
  marginRight: "16px",
});
const ItemDetails = styled("div")({
  flexGrow: 1,
  marginRight: "16px",
});

const ItemCost = styled(Typography)({
  fontWeight: "bold",
});

interface CartItemProps {
  item: {
    photo: string;
    reference: string;
    material: object;
    size: string;
    quantity: number;
    cost: number;
    grams: number;
  };
  onDecrease: () => void;
  onDelete: (reference: string, size: string) => void;
}


const CartItem: React.FC<CartItemProps> = ({ item, onDecrease, onDelete }) => {

  const handleDelete = () => {
    onDelete(item.reference, item.size);
  };

  console.log(item, "item")
  return (
    <ItemCard>
      <ItemImage src={item.photo} alt={item.reference} />
      <ItemDetails>
      <div>
  {Object.entries(item.material).map(([material, details]) => {
    if (typeof details.grams === "number" && !isNaN(details.grams) && details.grams > 0) {
      return (
        <div key={material}>
          <Typography variant="body2">
            material: {material}
          </Typography>
          <Typography variant="body2">
            grams: {details.grams}
          </Typography>
        </div>
      );
    } else if (typeof details.grams === "string" && !isNaN(parseFloat(details.grams)) && parseFloat(details.grams) > 0) {
      return (
        <div key={material}>
          <Typography variant="body2">
            material: {material}
          </Typography>
          <Typography variant="body2">
            grams: {parseFloat(details.grams)}
          </Typography>
        </div>
      );
    }
    return null;
  })}
</div>


        <Typography variant="body2">tamanho: {item.size}</Typography>
        <Typography variant="body2">Quantidade: {item.quantity}</Typography>
      </ItemDetails>
      <ItemCost variant="body1">€{item.cost}</ItemCost>
      <IconButton
        aria-label="Decrease"
        onClick={onDecrease}
        disabled={item.quantity === 1}
      >
        <RemoveIcon />
      </IconButton>
      <IconButton
        aria-label="Delete"
        onClick={handleDelete} // Call the handleDelete function instead of onDelete directly
      >
        <DeleteIcon />
      </IconButton>
    </ItemCard>
  );
};


interface OrdersModalProps {
  open: boolean;
  onClose: () => void;
  
}

export const OrdersModal: React.FC<OrdersModalProps & { setShowModal: React.Dispatch<React.SetStateAction<boolean>> }> = ({ onClose, open, setShowModal }) => {
  console.log(open, "onClose")
  const { data: user } = useGetIdentity<{
    email: string;
  }>();

  const { cartItems, clearCart, increase, decrease, removeFromCart, itemCount, handleCheckout } =
    useContext(CartContext);

  const [note, setNote] = useState(""); // State for storing the order note

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const handleClose = () => {
    setNote(""); // Clear the note state
    onClose(); // Call the onClose function
    setShowModal(false);
  };

  // const getTotalGramsByMaterial = () => {
  //   const gramsByMaterial: { [material: string]: number } = {};

  //   for (const item of cartItems) {
  //     const { material, grams } = item;

  //     if (gramsByMaterial[material]) {
  //       gramsByMaterial[material] += grams;
  //     } else {
  //       gramsByMaterial[material] = grams;
  //     }
  //   }
  //   console.log(gramsByMaterial);
  //   return gramsByMaterial;
  // };

  const getTotalGramsByMaterial = () => {
    const gramsByMaterial: { [material: string]: number } = {};
  
    cartItems.forEach((item) => {
      Object.entries(item.material).forEach(([material, details]) => {
        const grams =
          typeof details.grams === "number"
            ? details.grams
            : parseFloat(details.grams) || 0;
  
        const quantity = item.quantity || 0;
        const totalGrams = grams * quantity;
  
        if (totalGrams > 0) {
          gramsByMaterial[material] = (gramsByMaterial[material] || 0) + totalGrams;
        }
      });
    });
  
    return gramsByMaterial;
  };
  

  const gramsByMaterial = getTotalGramsByMaterial();

  const checkout = (cartItems: any) => {
    return async () => {
      const response = await fetch("http://localhost:8080/api/v1/orders", {
        method: "POST",
        body: JSON.stringify({
          cartItems,
          email: user?.email ?? "",
          NumberArticles: itemCount,
          Total: cartItems.reduce(
            (total: number, item: { cost: number; quantity: number }) =>
              total + item.cost * item.quantity,
            0
          ),
          note: note, // Include the note in the request body
         material: cartItems.material,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        handleCheckout();
      }
    };
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          maxWidth: 500,
          width: "100%",
          p: 2,
        }}
      >
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="h4">Encomendas</Typography>
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item: any, index: number) => (
                  <CartItem
                    key={index}
                    item={item}
                    onDecrease={() => decrease(item)}
                    onDelete={() => removeFromCart(item)}
                  />
                ))}
                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={2}
                  alignItems="center"
                  mt={isMobile ? 2 : 4}
                >
                  <Typography variant="h6" sx={{ mb: isMobile ? 2 : 0 }}>
                    Total: €
                    {cartItems.reduce(
                      (total, item) => total + item.cost * (item.quantity ?? 0),
                      0
                    )}
                  </Typography>
                  {Object.entries(gramsByMaterial).map(([material, totalGrams]) => (
    <Typography key={material} fontSize={14} color="#808191">
      {material}: {totalGrams} gr
    </Typography>
  ))}
                  {/* Note input field */}
                  <TextField
                    label="Order Note"
                    variant="outlined"
                    value={note}
                    onChange={handleNoteChange}
                  />
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartOutlinedIcon />}
                    onClick={checkout(cartItems)}
                    disabled={cartItems.length === 0}
                  >
                    Finalizar
                  </Button>
                </Stack>
                {/* Display grams by material */}
                <Stack direction="column" mt={2}>
                  {/* <Typography fontSize={14} color="#808191">
                    {cartItems.material.map((material: object) => (
                      <span key={material.type}>
                        {material.type}: {material.grams}
                      </span>
                    ))}
                  </Typography> */}
                </Stack>
              </>
            ) : (
              <Typography variant="body1">Carrinho vazio</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};
