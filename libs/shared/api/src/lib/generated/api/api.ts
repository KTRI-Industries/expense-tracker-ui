export * from './dashboardController.service';
import { DashboardControllerService } from './dashboardController.service';
import { FeatureFlagsControllerService } from './featureFlagsController.service';
import { ImportCsvControllerService } from './importCsvController.service';
import { RecurrentTransactionControllerService } from './recurrentTransactionController.service';
import { TenantControllerService } from './tenantController.service';
import { TransactionControllerService } from './transactionController.service';
import { UserControllerService } from './userController.service';

export * from './featureFlagsController.service';
export * from './importCsvController.service';
export * from './recurrentTransactionController.service';
export * from './tenantController.service';
export * from './transactionController.service';
export * from './userController.service';
export const APIS = [
  DashboardControllerService,
  FeatureFlagsControllerService,
  ImportCsvControllerService,
  RecurrentTransactionControllerService,
  TenantControllerService,
  TransactionControllerService,
  UserControllerService,
];
