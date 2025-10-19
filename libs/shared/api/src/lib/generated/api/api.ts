export * from './dashboardController.service';
import { DashboardControllerService } from './dashboardController.service';
export * from './featureFlagsController.service';
import { FeatureFlagsControllerService } from './featureFlagsController.service';
export * from './importCsvController.service';
import { ImportCsvControllerService } from './importCsvController.service';
export * from './recurrentTransactionController.service';
import { RecurrentTransactionControllerService } from './recurrentTransactionController.service';
export * from './tenantController.service';
import { TenantControllerService } from './tenantController.service';
export * from './transactionController.service';
import { TransactionControllerService } from './transactionController.service';
export * from './userController.service';
import { UserControllerService } from './userController.service';
export const APIS = [
  DashboardControllerService,
  FeatureFlagsControllerService,
  ImportCsvControllerService,
  RecurrentTransactionControllerService,
  TenantControllerService,
  TransactionControllerService,
  UserControllerService,
];
