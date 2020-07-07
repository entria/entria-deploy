import { getCommitRange } from '../shouldDeploy';

it('should extract commit range', () => {
  const compareUrl = 'https://github.com/sibelius/monorepo-101/compare/816d12236d385ce13a6b1363d573b4595ac033eb...8f8760552722ab7095403e014bdb8461a7a26ad0';
  const commitRange = getCommitRange(compareUrl);

  expect(commitRange).toBe('816d12236d385ce13a6b1363d573b4595ac033eb...8f8760552722ab7095403e014bdb8461a7a26ad0');
});

it('should use base ref', () => {
  const baseRef = 'master';
  const compareUrl = 'https://github.com/sibelius/monorepo-101/compare/816d12236d385ce13a6b1363d573b4595ac033eb...8f8760552722ab7095403e014bdb8461a7a26ad0';
  const commitRange = getCommitRange(compareUrl, baseRef);

  expect(commitRange).toBe('master...8f8760552722ab7095403e014bdb8461a7a26ad0');
});

it('should handle without to', () => {
  const baseRef = 'master';
  const compareUrl = 'https://github.com/sibelius/monorepo-101/compare/...816d12236d385ce13a6b1363d573b4595ac033eb';

  const commitRange = getCommitRange(compareUrl, baseRef);

  expect(commitRange).toBe('master...816d12236d385ce13a6b1363d573b4595ac033eb');
})
