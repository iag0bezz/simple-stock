export const RequiredVariables = [
  'SERVER_PORT',
  'DB_HOST',
  'DB_DATABASE',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_PORT',
  'JWT_SECRET',
  'JWT_EXPIRES',
];

interface Configuration {
  server: {
    port: number;
  };
  database: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
}

export const configuration = (): Configuration => {
  return {
    server: {
      port: parseInt(process.env.SERVER_PORT) || 3000,
    },
    database: {
      host: process.env.DB_HOST as string,
      port: parseInt(process.env.DB_PORT) as number,
      database: process.env.DB_DATABASE as string,
      username: process.env.DB_USERNAME as string,
      password: process.env.DB_PASSWORD as string,
    },
  };
};

export const validateAllVariables = () => {
  RequiredVariables.forEach((v) => {
    if (!process.env[v]) throw Error(`Missing required env variable ${v}`);
  });
};
