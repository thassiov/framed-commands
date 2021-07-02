import chalk from 'chalk';

export const logger = {
  ...console,
  debug: (...args:[unknown]): void => console.debug(...args.map(arg => chalk.dim(arg))),
};
