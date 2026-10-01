import {
  USE_MOCK,
  mockGetOrders,
  mockGetOrderById,
  mockCreateOrder,
  mockUpdateOrder,
  mockDeleteOrder,
  mockRestoreOrder,
} from './mock';
import * as service from './service';

export const getOrders = USE_MOCK.list ? mockGetOrders : service.getOrders;
export const getOrderById = USE_MOCK.detail ? mockGetOrderById : service.getOrderById;
export const createOrder = USE_MOCK.create ? mockCreateOrder : service.createOrder;
export const updateOrder = USE_MOCK.update ? mockUpdateOrder : service.updateOrder;
export const deleteOrder = USE_MOCK.delete ? mockDeleteOrder : service.deleteOrder;
export const restoreOrder = USE_MOCK.restore ? mockRestoreOrder : service.restoreOrder;
