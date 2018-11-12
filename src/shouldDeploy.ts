/**
CIRCLE_COMPARE_URL=https://github.com/owner/repo/compare/9324164e3f51...8aaaec63a3a6
  CIRCLE_COMPARE_URL=https://github.com/owner/repo/compare/37ac69404a5b...69bc6e3fe337
 CIRCLE_COMPARE_URL=https://github.com/owner/repo/commit/d11b95d4ee18

 CIRCLE_COMPARE_URL=https://github.com/owner/repo/compare/9324164e3...a2e2709c4

 LAST_HEAD...CHANGED_COMMIT
*/
import execa from 'execa';

const gitDiff = (cwd: string, ...args: string[]) => {
  return execa('git', ['diff', ...args], { cwd });
};

// if (!process.env.CIRCLE_COMPARE_URL) return null;
export const getCommitRange = (compareUrl: string | undefined) => {
  if (!compareUrl) return null;

  const re = /compare\/([0-9a-z]+)\.\.\.([0-9a-z]+)$/;
  const matches = compareUrl.match(re);

  if (matches && matches.length === 3) {
    return `${matches[1]}...${matches[2]}`;
  }

  return null;
};

export const shouldDeployPackage = (cwd: string) => (compareUrl: string | undefined) => async (pkg: string | string[]) => {
  const commitRange = getCommitRange(compareUrl);

  if (!commitRange) return false;

  try {
    const pkgs = Array.isArray(pkg) ? pkg : [pkg];
    const changes = await gitDiff(cwd, commitRange, '--name-only', ...pkgs);

    return changes.stdout !== '';
  } catch (err) {
    console.log('err: ', err);

    return false;
  }
};
