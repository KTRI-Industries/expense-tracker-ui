import { registerAuthCommands } from './auth.commands';
import { registerTransactionCommands } from './transactions.commands';
import { registerUserCommands } from './users.commands';

registerAuthCommands();
registerTransactionCommands();
registerUserCommands();

export { KEYCLOAK_URL } from './test-config';
