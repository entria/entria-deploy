import '@babel/polyfill';
import yargs from 'yargs';
import { shouldDeployPackage } from './shouldDeploy';

export type Path = string;
export type Argv = {
  arg1: string,
};

const usage = 'Usage: $0 <package-folder-name> <another-package-folder-name>';
const docs = 'Documentation: https://github.com/entria/entria-deploy';

export const run = async (argv?: Argv, project?: Path) => {
  argv = yargs(argv || process.argv.slice(2))
    .usage(usage)
    .epilogue(docs)
    .help()
    .argv;

  const shouldDeploy = shouldDeployPackage(process.cwd())(process.env.CIRCLE_COMPARE_URL);

  const result = await shouldDeploy(argv._.map((pkg: string) => `packages/${pkg}`));

  console.log('result: ', result);
  if (result) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}
