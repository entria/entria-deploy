import path from 'path';

import { shouldDeployPackage } from '../shouldDeploy';
import { getLastCommit, getShortCommitHash, initFixture, setupGitChanges } from '../../test/infra';

// Contains all relevant git config (user, commit.gpgSign, etc)
export const TEMPLATE = path.resolve(__dirname, 'template');

it('should deploy package 1 if something inside a folder changed', async () => {
  const packageName = 'package-1';

  const cwd = await initFixture(__dirname)('basic');

  const headCommit = await getLastCommit(cwd);

  await setupGitChanges(cwd, ['packages/package-1/random-file']);

  const changeCommit = await getLastCommit(cwd);

  const compareUrl = `https://github.com/entria/project/compare/${getShortCommitHash(
    headCommit.stdout,
  )}...${getShortCommitHash(changeCommit.stdout)}`;

  const shouldDeploy = shouldDeployPackage(cwd)(compareUrl);

  expect(await shouldDeploy(`packages/${packageName}`)).toBe(true);
});

it('should not deploy package 1 if nothing inside a folder changed', async () => {
  const packageName = 'package-1';

  const cwd = await initFixture(__dirname)('basic');

  const headCommit = await getLastCommit(cwd);

  await setupGitChanges(cwd, ['packages/package-2/random-file']);

  const changeCommit = await getLastCommit(cwd);

  const compareUrl = `https://github.com/entria/project/compare/${getShortCommitHash(
    headCommit.stdout,
  )}...${getShortCommitHash(changeCommit.stdout)}`;

  const shouldDeploy = shouldDeployPackage(cwd)(compareUrl);

  expect(await shouldDeploy(packageName)).toBe(false);
});

it('should deploy package 3 if package 3 or common package has changed', async () => {
  const packageName = 'package-3';
  const pkgs = [`packages/${packageName}`, 'packages/common'];

  const cwd = await initFixture(__dirname)('basic');

  const headCommit = await getLastCommit(cwd);

  await setupGitChanges(cwd, ['packages/common/random-file']);

  const changeCommit = await getLastCommit(cwd);

  const compareUrl = `https://github.com/entria/project/compare/${getShortCommitHash(
    headCommit.stdout,
  )}...${getShortCommitHash(changeCommit.stdout)}`;

  const shouldDeploy = shouldDeployPackage(cwd)(compareUrl);

  expect(await shouldDeploy(pkgs)).toBe(true);
});
