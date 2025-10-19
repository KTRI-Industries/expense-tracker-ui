# shared-feature-flags

This library contains the feature flags state management for the expense tracker application.

## Running unit tests

Run `nx test shared-feature-flags` to execute the unit tests.
{
  "name": "shared-feature-flags",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/shared/feature-flags/src",
  "prefix": "expense-tracker-ui",
  "tags": [],
  "projectType": "library",
  "targets": {
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "libs/shared/feature-flags/jest.config.ts"
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": ["{options.outputFile}"]
    }
  }
}

