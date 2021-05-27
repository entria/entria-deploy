# Entria Deploy

- Gives a list of paths that changed from a compare url, example below:

```
https://github.com/sibelius/monorepo-101/compare/1662e1d...0edb974
```

- Check if a determined path has changed from a compare url

## How to install

```
yarn add @entria/deploy --dev
```

## Usage with CircleCI

Add CIRCLECI_COMPARE_URL environment to your .circleci/config.yml

```jsx
environment:
    CIRCLECI_COMPARE_URL: << pipeline.project.git_url >>/compare/<< pipeline.git.base_revision >>...<<pipeline.git.revision>>
```

### Get files to be tested by jest

```jsx
TESTFILES=$(yarn entria-deploy changes $CIRCLECI_COMPARE_URL)
yarn jest --maxWorkers=3 --coverage --forceExit --ci
```

### Check if you need to deploy some package
```jsx
SHOULD_BUILD=$(yarn entria-deploy hasChanged $CIRCLECI_COMPARE_URL packages/api)
if [ "$SHOULD_BUILD" == false ]; then
  circleci-agent step halt
fi
```

## Usage in JavaScript/TypeScript

```jsx
import { shouldDeployPackage, changedPaths } from '@entria/deploy';

// it should be another compare url, from Travir of instance
const shouldDeploy = shouldDeployPackage(process.cwd())(process.env.CIRCLE_COMPARE_URL);

if (shouldDeploy('packages/server') {
    console.log('deploy server');
}

const allchanges = await changedPaths(process.env.CIRCLE_COMPARE_URL);
console.log('all changes');
```
