import React, { useContext, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import {
  AppBar,
  IconButton,
  Avatar,
  Stack,
  Toolbar,
  Typography,
  Badge,
  BadgeProps,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { RefineThemedLayoutHeaderProps } from "@refinedev/mui";
import { DarkModeOutlined, LightModeOutlined, Menu } from "@mui/icons-material";
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';

import { ColorModeContext } from "../../contexts/color-mode";

import CartContext from "contexts/Cart/CartContext";
import { typography } from "@mui/system";
import { OrdersModal } from '../../components/common/ordersModal';


type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutHeaderProps> = ({
  isSiderOpen,
  onToggleSiderClick,
  toggleSiderIcon: toggleSiderIconFromProps,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);

  const { data: user } = useGetIdentity<IUser>();

  const hasSidebarToggle = Boolean(onToggleSiderClick);

  const [toggle, setToggle] = useState(false);
  // Extract itemscount from CartContext
  //@ts-ignore
  const { cartItems, itemCount } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setShowModal(true);
  };


  const handleModalClose = () => {
    setShowModal(false);
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 10,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          {hasSidebarToggle && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => onToggleSiderClick?.()}
              edge="start"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                ...(isSiderOpen && { display: "none" }),
              }}
            >
              {toggleSiderIconFromProps?.(Boolean(isSiderOpen)) ?? <Menu />}
            </IconButton>
          )}

          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
          >
            {/* <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton> */}
            <div
            onClick={handleModalOpen}
            >
   {/* Show the modal if showModal is true */}
   { <OrdersModal open={showModal} onClose={handleModalClose} setShowModal={setShowModal}/>}
            {cartItems.length > 0 && (
                 <Stack
                 direction="row"
                 >
                  <IconButton aria-label="cart">
      <StyledBadge badgeContent={itemCount} color="secondary">
        <ShoppingCartCheckoutOutlinedIcon />
      </StyledBadge>
    </IconButton>
                  </Stack>
            )}
            
           
            
            </div>
          

  
            {(user?.avatar || user?.name) && (
              <Stack
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                {user?.name && (
                  <Typography variant="subtitle2">{user?.name}</Typography>
                )}
                <Avatar src={user?.avatar} alt={user?.name} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
