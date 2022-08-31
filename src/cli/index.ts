import inquirer from 'inquirer';
import { logger } from '../utils/logger.util.js';
import { validateAppName } from '../utils/validate.util.js';

interface CliResults {
  appName: string;
  manager: 'npm' | 'pnpm' | 'yarn';
}

async function runCli() {
  const cliResults: CliResults = {
    appName: 'app',
    manager: 'npm',
  };

  const { appName } = await inquirer.prompt<Pick<CliResults, 'appName'>>({
    name: 'appName',
    type: 'input',
    message: 'Qual o nome do novo projeto?',
    default: 'app',
    validate: validateAppName,
    transformer: (input: string) => {
      return input.trim();
    },
  });
  cliResults.appName = appName;

  logger.success('Beleza , seu app vai se chamar', appName);

  const { manager } = await inquirer.prompt({
    name: 'manager',
    type: 'list',
    message: 'Qual o gerenciador de pacote deseja utilizar?',
    choices: [
      { name: 'npm', value: 'npm', short: 'npm' },
      { name: 'pnpm', value: 'pnpm', short: 'pnpm' },
      { name: 'yarn', value: 'yarn', short: 'yarn' },
    ],
    default: 'npm',
  });

  cliResults.manager = manager;

  return cliResults;
}

export default runCli;
