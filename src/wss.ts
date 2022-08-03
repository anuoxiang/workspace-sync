#!/usr/bin/env node
import * as commander from 'commander';
import { CommandLoader } from './command-loader';

// const version = require('../package.json').version;
const version = '0.1.0';

const bootstrap = () => {
  const program = new commander.Command();

  program
    .description(
      `Sync your all projects in the workspace directory.
    Workspace Syncer (${version})\t\tdjango@leadleo.com 2022-07-09`,
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

bootstrap();
