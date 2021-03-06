import { getCommitRange, shouldDeployPackage } from '../shouldDeploy';

export const command = 'hasChanged <compareUrl> [paths..]';
export const desc = 'check if given paths were changed';
export const builder = {
  baseRef: {
    description: 'baseUrl to compare to',
  },
};
export const handler = async (argv) => {
  const { compareUrl, baseRef, paths } = argv;

  const commitRange = getCommitRange(compareUrl, baseRef);

  if (!commitRange) {
    console.log('no commit range');
    return;
  }

  const shouldDeploy = shouldDeployPackage(process.cwd())(compareUrl);

  const result = await shouldDeploy(paths);

  // eslint-disable-next-line
  console.log('result: ', result);
  if (result) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}
