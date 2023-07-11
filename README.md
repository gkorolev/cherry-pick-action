<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

## This is a little bit modified fork of: [cherry-pick-action](https://github.com/Xealth/cherry-pick-action)


# A Cherry Pick GitHub Action 🍒 

Automatically create a cherry pick `pull-request` to user defined `labels` and/or static release branches!

- [What does it do?](#-what-does-it-do)  
- [Differences](#differences-from-cherry-pick-action)  
- [Examples/Demos](#-examplesdemos) 
- [Usage](#-usage)
- [Configuration](#-configuration) 
- [Inputs](#action-inputs)

---

## 🤔 What does it do? 

This action will:

- Checkout the triggered action.
- Create the new branch name `cherry-pick-${GITHUB_SHA}` from `branch` input.
- Cherry-pick the `${GITHUB_SHA}` into the created `branch`
- Push a new `branch` to `remote`
- Open a pull request to `branch`

----

## Differences from [cherry-pick-action](https://github.com/marketplace/actions/github-cherry-pick-action)

In the other action, a user must specify the release branch in the `workflow`; This action allows for users to input their own branches via `labels`.
This action also supports specifying multiple release branches in **one PR**. 

----

## 🕺 Usage

Usage depends on your needs. Please see the following options:

**Do you want users to be able to specify the release branches dynamically via `labels`?**

- Please see [User Defined Labels](#user-defined-labels) and its [inputs](#user-defined-labels-1).

**Want to statically define a release branch or trigger it based on other logic?**

- Please see [Basic Configuration](#basic-configuration) and its [inputs](#basic-configuration-1)

----

## 📋 Configuration

Some examples:

### User Defined Labels

Cherry-picking pull requests merged on main with any label, matching regular expression, taken from **labelPatternRequirement** field.

#### Workflow:
 - Prereq: have ***main*** branch and ***release/20230730*** branch, forked from ***main***
 - Create "feature" branch to work on feature(***feature***)
 - Commit new change(s) into ***feature*** branch
 - Create Pull Request from ***feature*** to ***main*** branch
 - Let's pretend that we decided to cherry pick that Pull Request to ***release/20230730*** branch
 - To cherry pick automatically - just apply "label", name of which corresponds to the name of the "release" branch. In out case apply label "release/20230730" to the Pull Request opened. Pls see example below. Note: Pull requests, containing cherry picks, will be created for each pull requests on ***main***, labeled according to the above. Also additional label will be applied to these pull requests from ***labels*** field, see example("in our case "cherry-pick")


```
on:
  pull_request:
    branches:
      - main
    types: ["labeled"]

jobs:
  cherry-pick-release
    runs-on: ubuntu-latest
    name: Cherry pick into release branch
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Auto cherry pick
        uses: gkorolev/cherry-pick-action@v1.0.0
        with:
          allowUserToSpecifyBranchViaLabel: 'true'
          labelPatternRequirement: 'release/[0-9]*' 
          labels: |
            cherry-pick
          reviewers: |
            gkorolev
            devops
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Basic Configuration

Cherry-picking pull requests merged on main to branch *release-v1.0* in pull requests labeled with **release-v1.0** and to branch *release-v2.0* in pull requests labeled with **release-v2.0**.

```yml
on:
  pull_request:
    branches:
      - main
    types: ["closed"]

jobs:
  cherry_pick_release_v1_0:
    runs-on: ubuntu-latest
    name: Cherry pick into release-v1.0
    if: contains(github.event.pull_request.labels.*.name, 'release-v1.0')
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Cherry pick into release-v1.0
        uses: gkorolev/cherry-pick-action@v1.0.0
        with:
          branch: release-v1.0
          labels: |
            cherry-pick
          reviewers: |
            aReviewerUser
  cherry_pick_release_v2_0:
    runs-on: ubuntu-latest
    name: Cherry pick into release-v2.0
    if: contains(github.event.pull_request.labels.*.name, 'release-v2.0')
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Cherry pick into release-v2.0
        uses: gkorolev/cherry-pick-action@v1.0.0
        with:
          branch: release-v2.0
          labels: |
            cherry-pick
          reviewers: |
            aReviewerUser
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
----


## Action inputs

#### Basic Configuration
If your release branches do not change often, setting up user defined labels might not be necessary. 

| Name | Description | Default |
| --- | --- | --- |
| `token` | `GITHUB_TOKEN` or a `repo` scoped [Personal Access Token (PAT)](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). | `GITHUB_TOKEN` |
| `committer` | The committer name and email address in the format `Display Name <email@address.com>`. Defaults to the GitHub Actions bot user. | `GitHub <noreply@github.com>` |
| `author` | The author name and email address in the format `Display Name <email@address.com>`. Defaults to the user who triggered the workflow run. | `${{ github.actor }} <${{ github.actor }}@users.noreply.github.com>` |
| `branch` | Name of the branch to merge the cherry pick. | `create-pull-request/patch` |
| `labels` | A comma or newline-separated list of labels. | |
| `assignees` | A comma or newline-separated list of assignees (GitHub usernames). | |
| `reviewers` | A comma or newline-separated list of reviewers (GitHub usernames) to request a review from. | |
| `team-reviewers` | A comma or newline-separated list of GitHub teams to request a review from. Note that a `repo` scoped [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) may be required. | |

If you'd like users to cherry pick based on label input, see below:

#### User Defined Labels
| Name | Description | Default |
| --- | --- | --- |
| `allowUserToSpecifyBranchViaLabel` | Must be `true` (string) if enabled, Allows the user to specify which branch or branches to cherry pick to via their label | |
| `labelPatternRequirement` | If the above is true, a user can specify a label pattern to look for. Example: "release/[0-9]*" will find labels and matching release branches like "release/20230730" or "release/123" etc. You can put regex or exactly matching string ||

- _Keep in mind, `branch` will be overriden if `allowUserToSpecifyBranchViaLabel` is set true!_


_Note from the [original author](carloscastrojumo/github-cherry-pick-action):_

### Working with forked repositories

If you are using this action while working with forked repositories (e.g. when you get pull requests from external contributors), you will have to adapt the trigger to avoid permission problems.

In such a case you should use the `pull_request_target` trigger, which was introduced by github for this usecase.

### Example 

```yml
on:
  pull_request_target:
    branches:
      - main
    types: ["closed"]
 ...


## License

[MIT](LICENSE)
