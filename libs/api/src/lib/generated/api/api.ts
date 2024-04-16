export * from './keycloakIntegrationController.service';
import { KeycloakIntegrationControllerService } from './keycloakIntegrationController.service';
import { TenantControllerService } from './tenantController.service';
import { TransactionControllerService } from './transactionController.service';

export * from './tenantController.service';
export * from './transactionController.service';
export const APIS = [
  KeycloakIntegrationControllerService,
  TenantControllerService,
  TransactionControllerService,
];
