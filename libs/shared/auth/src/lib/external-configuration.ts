/*This needs to be a class and not an interface to be used as provider (why though?)*/
export class ExternalConfiguration {
  allowedOrigins: string[] = [];
  basePath = '';
}
