export * from './tenantController.service';
import { TenantControllerService } from './tenantController.service';
import { TransactionControllerService } from './transactionController.service';
import { UserControllerService } from './userController.service';

export * from './transactionController.service';
export * from './userController.service';
export const APIS = [
  TenantControllerService,
  TransactionControllerService,
  UserControllerService,
];
