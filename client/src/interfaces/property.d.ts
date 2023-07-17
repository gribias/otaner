import { BaseKey } from '@pankod/refine-core';

export interface FormFieldProp {
  reference: string,
  labelName: string
}

export interface FormValues {
  reference: string,
    description: string,
    propertyType: string,
    grams:number,
    material: string,
    cost: number ,
}

export interface PropertyCardProps {
  id?: BaseKey | undefined;
  reference: string;
  material: Material[];
  cost: number;
  photo: string;
}

interface Material {
  type: string;
  grams: number;
}


// export interface IOrder {
//   id: number;
//   //user: IUser;
//   createdAt: string;
//   products: PropertyCardProps[];
//   //status: IOrderStatus;
//   //adress: IAddress;
//   //store: IStore;
//   //courier: ICourier;
//   events: IEvent[];
//   orderNumber: number;
//   amount: number;
// }

interface IOrder {
  grams: { [type: string]:  number  };
  _id: string;
  user: string;
  orderDate: "string";
  orderNumber: string;
  NumberArticles: number;
  Total: number;
  products: {
    _id: {
      _id: string;
      reference: string;
      cost: number;
    };
    quantity: number;
    _id: string;
    valueOptions?: ValueOptions[]; 
  }[];
  creator: string;
  material: {
    [type: string]: {
      grams: number;
    };
  };
  __v: number;
}

export interface IOrderFilterVariables {
  q?: string;
  material?: string;
  user?: string;
  status?: string[];
}

export interface IEvent {
  date: string;
  status: string;
}