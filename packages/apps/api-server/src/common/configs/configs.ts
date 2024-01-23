import type { Config } from './configs.interface';

const configs: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'AIONX-API FTW',
    description: 'The aionx-api-server API description',
    version: '1.5',
    path: 'swagger',
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => configs;
