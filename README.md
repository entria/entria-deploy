# Entria Deploy

Helpers to manage deployments in monorepos

## How to install

```
yarn global add @entria/deploy
```

## Usage with CircleCI

check if `server` package has changed:
```
entria-deploy server
```

## Usage in JavaScript

```jsx
const { shouldDeployPackage } from '@entria/deploy';

// it should be another compare url, from Travir of instance
const shouldDeploy = shouldDeployPackage(process.cwd())(process.env.CIRCLE_COMPARE_URL);

if (shouldDeploy('server') {
    console.log('deploy server');
}

```
