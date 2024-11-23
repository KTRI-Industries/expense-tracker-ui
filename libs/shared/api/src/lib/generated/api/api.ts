export * from './dashboardController.service';
import { DashboardControllerService } from './dashboardController.service';
import { RecurrentTransactionControllerService } from './recurrentTransactionController.service';
import { TenantControllerService } from './tenantController.service';
import { TransactionControllerService } from './transactionController.service';
import { UserControllerService } from './userController.service';

export * from './recurrentTransactionController.service';
export * from './tenantController.service';
export * from './transactionController.service';
export * from './userController.service';
export const APIS = [
  DashboardControllerService,
  RecurrentTransactionControllerService,
  TenantControllerService,
  TransactionControllerService,
  UserControllerService,
];
