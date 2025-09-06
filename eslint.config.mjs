import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // 훅 사용 규칙을 명확히 에러로 처리해 조기 감지
      "react-hooks/rules-of-hooks": "error",
      // 의존성 경고는 유지(필요 시 점진 개선)
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
