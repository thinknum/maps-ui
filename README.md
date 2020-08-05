# maps-ui

## Installation

This package is hosted on GitHub Packages. To install it using Yarn, you will first need to create a `.npmrc` file in your project directory:

```
touch .npmrc
```

In this file, set up a custom repository URL for all packages in the `@thinknum` namespace:

```
@thinknum:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<AUTH TOKEN>
```

**Auth token should be generated from your personal GitHub account, with only one scope: `read:packages`.** (If you want to avoid committing auth token into Git repo, you can create `.npmrc` in your home directory, and then in the home directory of each server you're deploying to.)

Now you can install the package as usual:

```
yarn add @thinknum/maps-ui
```

## Publishing a new version

This package is set up to be published on GitHub Packages. (Via `publishConfig` key in `package.json`.) In order to publish a new version, first make sure you are logged in to GitHub Packages registry:

```
npm login --registry=https://npm.pkg.github.com --scope=@github_user
```

Running this command will prompt you for your username. For username, enter you regular username, and for password enter a Personal Access Token generated with `write:packages` and `read:packages` scopes.

Now you are logged in to GitHub Packages registry. Before publishing, update your version to the number you wish to publish. Make sure this number isn't used yet - GitHub Packages won't allow you rewriting existing published version.

Commit your changed version number. Next, build the source into `dist/` directory. **The dist/ directory is ignored by `.gitignore`**.

```
yarn build
```

Once built, run publish to the registry:

```
npm publish
```


A new version will be published. You can verify right in the GitHub repository:

<img src="http://kgbase.s3.amazonaws.com/help_images/sRAYCUxNfjjeRG95WZ5X.png" width="600" />
