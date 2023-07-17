import { IResourceComponentsProps } from "@refinedev/core";
import { MuiListInferencer } from "@refinedev/inferencer/mui";
import AllOrders from "pages/allOrders"

export const OrderList: React.FC<IResourceComponentsProps> = () => {
  return (
    <>
      <AllOrders/>
    </>
  );
};
