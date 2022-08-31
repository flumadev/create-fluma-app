import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import fs from 'fs-extra';
import inquirer from 'inquirer';

import { logger } from './logger.util.js';

interface CreateProjectOptions {
  appName: string;
  manager: 'npm' | 'pnpm' | 'yarn';
}
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, '../');
const srcDir = path.join(PKG_ROOT, 'src/template/base');

export const createProject = async ({
  appName,
  manager,
}: CreateProjectOptions) => {
  const projectDir = path.resolve(process.cwd(), appName);

  logger.info(`\nUsando: ${chalk.cyan.bold(manager)}\n`);
  const spinner = ora(`Scaffolding in: ${projectDir}...\n`).start();

  if (fs.existsSync(projectDir)) {
    if (fs.readdirSync(projectDir).length > 0) {
      spinner.stopAndPersist();

      const { overwriteDir } = await inquirer.prompt<{
        overwriteDir: 'abort' | 'clear' | 'overwrite';
      }>({
        name: 'overwriteDir',
        type: 'list',
        message: `${chalk.redBright.bold('Warning:')} ${chalk.cyan.bold(
          appName
        )} já existe e não está vazia. Como deseja continuar?`,
        choices: [
          {
            name: 'Abortar instalação (recomendado)',
            value: 'abort',
            short: 'Abort',
          },
          {
            name: 'Limpar diretório e continuar instalação',
            value: 'clear',
            short: 'Clear',
          },
          {
            name: 'Continuar instalação e sobrescrever arquivos',
            value: 'overwrite',
            short: 'Overwrite',
          },
        ],
        default: 'abort',
      });

      if (overwriteDir === 'abort') {
        spinner.fail('Cancelando instalação...');
        process.exit(0);
      }

      const overwriteAction =
        overwriteDir === 'clear'
          ? 'limpar o diretório'
          : 'sobrescrever arquivos com conflito';

      const { confirmOverwriteDir } = await inquirer.prompt<{
        confirmOverwriteDir: boolean;
      }>({
        name: 'confirmOverwriteDir',
        type: 'confirm',
        message: `Tem certeza que deseja ${overwriteAction}?`,
        default: false,
      });

      if (!confirmOverwriteDir) {
        spinner.fail('Abortando instalação...');
        process.exit(0);
      }

      if (overwriteDir === 'clear') {
        spinner.info(`Limpando ${chalk.cyan.bold(appName)} ..\n`);
        fs.emptyDirSync(projectDir);
      }
    }
  }

  spinner.start();

  await fs.copy(srcDir, projectDir);
  await fs.rename(
    path.join(projectDir, '_gitignore'),
    path.join(projectDir, '.gitignore')
  );

  spinner.succeed(`${chalk.cyan.bold(appName)} scaffolded successfully!\n`);

  return projectDir;
};
