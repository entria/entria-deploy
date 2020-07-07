/**
CIRCLE_COMPARE_URL=https://github.com/owner/repo/compare/9324164e3f51...8aaaec63a3a6
  CIRCLE_COMPARE_URL=https://github.com/owner/repo/compare/37ac69404a5b...69bc6e3fe337
 CIRCLE_COMPARE_URL=https://github.com/owner/repo/commit/d11b95d4ee18

 CIRCLE_COMPARE_URL=https://github.com/owner/repo/compare/9324164e3...a2e2709c4
 CIRCLE_COMPARE_URL=https://github.com/owner/repo/compare/...a2e2709c4

 LAST_HEAD...CHANGED_COMMIT
*/
import execa from 'execa';

export const gitDiff = (cwd: string, ...args: string[]) => {
  return execa('git', ['diff', ...args], { cwd });
};

export const getCommitRange = (compareUrl: string | undefined, baseRef?: string) => {
  if (!compareUrl) return null;

  // handle compare with only from part
  const onlyFromRe = /compare\/\.\.\.([0-9a-z]+)$/;
  const m = compareUrl.match(onlyFromRe);

  if (m && m.length === 2) {
    const [, from] = m;
    if (baseRef) {
      return `${baseRef}...${from}`;
    }

    // fallback to `master` if there is no baseRef
    return `master...${from}`;
  }

  const re = /compare\/([0-9a-z]+)\.\.\.([0-9a-z]+)$/;
  const matches = compareUrl.match(re);

  const [, to, from] = matches;

  if (matches && matches.length === 3) {
    if (baseRef) {
      return `${baseRef}...${from}`;
    }

    return `${to}...${from}`;
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
