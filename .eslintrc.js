{
  "root": true,
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "project": "./tsconfig.json", // required for rules that need type information
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "plugins": [
      "@typescript-eslint"
    ],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended"
    ]
}
