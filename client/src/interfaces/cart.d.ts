export interface ICart {
    id: string;
    reference: string;
    material: Material[];
    photo: string;
    cost: number;
    quantity?: number;
    size: string;
  }

  interface Material {
    type: string;
    grams: number;
  }
  