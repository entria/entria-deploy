import fs from 'fs-extra';
import execa from 'execa';
import tempy from 'tempy';
import os from 'os';
import tempWrite from 'temp-write';
import path from 'path';
import touch from 'touch';
import { TEMPLATE } from '../src/__tests__/shouldDeploy.spec';

export const gitInit = (cwd: string, ...args: string[]) => {
  return execa('git', ['init', '--template', TEMPLATE, ...args], { cwd });
};

export const gitAdd = (cwd: string, ...files: string[]) => {
  return execa('git', ['add', ...files], { cwd });
};

export const gitCommit = (cwd: string, message: string) => {
  if (message.indexOf(os.EOL) > -1) {
    // Use tempfile to allow multi\nline strings.
    return tempWrite(message).then((fp) =>
      execa('git', ['commit', '-F', fp], { cwd }),
    );
  }

  return execa('git', ['commit', '-m', message], { cwd });
};

export const getLastCommit = (cwd: string, ...args: string[]) => {
  return execa('git', ['rev-parse', 'HEAD'], { cwd });
};

export const findFixture = (cwd: string, fixtureName: string) => {
  const fixturePath = path.join(cwd, '__fixtures__', fixtureName);

  return fixturePath;
};

export const copyFixture = (
  targetDir: string,
  fixtureName: string,
  cwd: string,
) => {
  const fp = findFixture(cwd, fixtureName);

  return fs.copy(fp, targetDir);
};

export const initFixture = (startDir: string) => {
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

export const setupGitChanges = async (cwd: string, filePaths: string[]) => {
  for (const fp of filePaths) {
    const fullPath = path.join(cwd, fp);
    await touch(fullPath);
  }

  await gitAdd(cwd, '-A');
  await gitCommit(cwd, 'Commit');
};

export const getShortCommitHash = (hash: string) => {
  return hash.slice(0, 12);
};
