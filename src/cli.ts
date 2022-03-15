import "core-js/stable";
import "regenerator-runtime/runtime";
import yargs from 'yargs';
import * as changedPath from './commands/changedPaths';
import * as hasChanged from './commands/hasChanged';

export type Path = string;
export type Argv = {
  arg1: string,
};

export const run = async (argv?: Argv) => {
  yargs(argv || process.argv.slice(2))
    .command(changedPath)
    .command(hasChanged)
    .demandCommand()
    .help()
    .argv;
}
