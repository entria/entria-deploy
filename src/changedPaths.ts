import { getCommitRange, gitDiff } from './shouldDeploy';

// return paths that changed in the compare url
export const changedPaths = async (
  compareUrl: string,
  baseRef?: string,
                                   ): Promise<string[]> => {
  const commitRange = getCommitRange(compareUrl, baseRef);

  if (!commitRange) {
    return [];
  }

  const cwd = process.cwd();

  const changes = await gitDiff(cwd, commitRange, '--name-only');

  if (changes.stdout) {
    return changes.stdout.split('\n');
  }

  return [];
};
