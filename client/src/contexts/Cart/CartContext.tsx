import { createContext } from "react";
import { ICart } from "../../interfaces/cart";

interface ICartContext {
  cartItems: ICart[];
  clearCart: () => void;
  increase: (payload: ICart) => void;
  decrease: (payload: ICart) => void;
  removeFromCart: (payload: ICart) => void;
  itemCount: number;
  handleCheckout: () => void;
  updateItemNote: (itemId: string, note: string) => void; // Add the updateItemNote function
}

const CartContext = createContext<ICartContext>({
  cartItems: [],
  clearCart: () => {},
  increase: () => {},
  decrease: () => {},
  removeFromCart: () => {},
  itemCount: 0,
  handleCheckout: () => {},
  updateItemNote: () => {}, // Provide an empty implementation for now
});

export default CartContext;
