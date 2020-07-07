import { changedPaths } from '../changedPaths';

export const command = 'changes <compareUrl>';
export const desc = 'Get files changed from a compare-url';
export const builder = {
  baseRef: {
    demandOption: false,
  }
};
export const handler = async (argv) => {
  const { compareUrl, baseRef } = argv;

  const changes = await changedPaths(compareUrl, baseRef);

  // eslint-diable-next-line
  console.log(changes.join('\n'));
}
