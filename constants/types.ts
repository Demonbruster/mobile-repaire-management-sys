export interface IBrand {
  id?: string;
  name: string;
}

export interface IModel {
  id?: string;
  name: string;
  brand: IBrand;
}

export interface ICustomer {
  id?: string;
  name?: string;
  phone: string | string[];
}

export interface IDevice {
  id?: string;
  name: string;
  model: IModel;
  imei?: string;
  color?: string;
}

export interface IRepairer extends IDevice {
  customer: ICustomer;
  status: 'taken' | 'delivered' | 'processing' | 'done' | 'returned';
  charge?: number;
  problem?: string;
  note?: string;
  entryDate: Date;
  expectedDeliveryDate?: Date;
  deliveryDate?: Date;
}

export const IReactQueryKey = {
  devices : 'DEVICES',
  device : 'DEVICE',
  brands : 'BRANDS',
  models : 'MODELS',
  repairers : 'REPAIRERS',
  repairer : 'REPAIRER',
  customers : 'CUSTOMERS',
}
