#!/usr/bin/env node

import runCli from './cli/index.js';
import fs from 'fs-extra';
import path from 'path';
import { createProject } from './utils/create-project.helper.js';
import { renderTitle } from './utils/title.util.js';
import { execa } from './utils/exec.util.js';
import ora from 'ora';
import chalk from 'chalk';

async function main() {
  renderTitle();

  const { appName, manager } = await runCli();

  const projectDir = await createProject({
    appName,
    manager,
  });

  const pkgJson = await fs.readJSON(path.join(projectDir, 'package.json'));
  pkgJson.name = appName;
  pkgJson.version = '0.0.0';
  await fs.writeJSON(path.join(projectDir, 'package.json'), pkgJson, {
    spaces: 2,
  });

  await execa('clear');

  const spinner = ora(`Instalando dependencias em ${appName}...\n`).start();

  await execa(`${manager} install`, { cwd: projectDir });

  spinner.info('Dependencias instaladas\n').stop();

  console.info(chalk.greenBright(`Para iniciar o app, execute \n`));

  console.info(chalk.cyan(`cd ${appName}`));
  console.info(chalk.cyan(`${manager} run dev\n\n`));

  process.exit(0);
}

main().catch((error) => {
  console.log(error);
});
