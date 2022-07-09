#!/usr/bin/env node
import * as commander from 'commander';

import { CommandLoader } from '../commands';

const version = require('../../package.json').version;
const bootstrap = () => {
  disclaimer();
  const program = new commander.Command();

  program
    .description(
      'Sync your all projects in the workspace directory.',
    )
    .version(
      version,
      '-v, --version',
      'Workspace syncer current version.',
    )
    .usage('<command> [options]')
    .helpOption(
      '-h, --help',
      'Output the usage of workspace sync information.',
    );

  CommandLoader.load(program);

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

const disclaimer = () => {
  console.log();
  console.log(
    `Workspace Syncer (${version})\t\tdjango@leadleo.com 2022-07-09`,
  );
  console.log();
};

bootstrap();
