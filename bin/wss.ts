#!/usr/bin/env node
import * as commander from 'commander';

import { CommandLoader } from '../commands';

const bootstrap = () => {
  const program = new commander.Command();
  program
    .version(
      require('../../package.json').version,
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
