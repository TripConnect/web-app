import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:31071/graphql',
  documents: ['src/**/*.graphql', 'src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      config: {
        flattenGeneratedTypes: true,
        flattenGeneratedTypesIncludeFragments: true,
        nullability: {
          errorHandlingClient: true
        },
        avoidOptionals: true,
        maybeValue: 'T | null'
      }
    }
  }
};

export default config;