import { changedPaths } from '../changedPaths';

export const command = 'changes <compareUrl>';
export const desc = 'Get files changed from a compare-url';
export const builder = {};
export const handler = async (argv) => {
  const { compareUrl } = argv;

  const changes = await changedPaths(compareUrl);

  // eslint-diable-next-line
  console.log(changes.join('\n'));
}
