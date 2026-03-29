import { registerAuthCommands } from './auth.commands';
import { registerApiCommands } from './api.commands';
import { registerTransactionCommands } from './transactions.commands';
import { registerUserCommands } from './users.commands';

registerAuthCommands();
registerApiCommands();
registerTransactionCommands();
registerUserCommands();

export { KEYCLOAK_URL } from './test-config';
