import tempy from 'tempy';
import execa from 'execa';
import path from 'path';
import fs from 'fs-extra';
import findUp from 'find-up';
import os from 'os';
import tempWrite from 'temp-write';
import touch from 'touch';

import { shouldDeployPackage } from '../shouldDeploy';

// Contains all relevant git config (user, commit.gpgSign, etc)
const TEMPLATE = path.resolve(__dirname, 'template');

const gitInit = (cwd: string, ...args: string[]) => {
  return execa('git', ['init', '--template', TEMPLATE, ...args], { cwd });
};

const gitAdd = (cwd: string, ...files: string[]) => {
  return execa('git', ['add', ...files], { cwd });
};

const gitCommit = (cwd: string, message: string) => {
  if (message.indexOf(os.EOL) > -1) {
    // Use tempfile to allow multi\nline strings.
    return tempWrite(message).then(fp => execa('git', ['commit', '-F', fp], { cwd }));
  }

  return execa('git', ['commit', '-m', message], { cwd });
};

const getLastCommit = (cwd: string, ...args: string[]) => {
  return execa('git', ['rev-parse', 'HEAD'], { cwd });
};

const findFixture = (cwd: string, fixtureName: string) => {
  return findUp(path.join('__fixtures__', fixtureName), { cwd }).then(fixturePath => {
    if (fixturePath === null) {
      throw new Error(`Could not find fixture with name "${fixtureName}"`);
    }

    return fixturePath;
  });
};

const copyFixture = (targetDir: string, fixtureName: string, cwd: string) => {
  return findFixture(cwd, fixtureName).then(fp => fs.copy(fp, targetDir));
};

const initFixture = (startDir: string) => {
  return async (fixtureName: string, commitMessage: string = 'Init commit') => {
    const cwd = tempy.directory();

    process.chdir(startDir);
    await copyFixture(cwd, fixtureName, startDir);
    await gitInit(cwd, '.');

    if (commitMessage) {
      await gitAdd(cwd, '-A');
      await gitCommit(cwd, commitMessage);
    }

    return cwd;
  };
};

const setupGitChanges = async (cwd: string, filePaths: string[]) => {
  for (const fp of filePaths) {
    const fullPath = path.join(cwd, fp);
    await touch(fullPath);
  }

  await gitAdd(cwd, '-A');
  await gitCommit(cwd, 'Commit');
};

const getShortCommitHash = (hash: string) => {
  return hash.slice(0, 12);
};

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
