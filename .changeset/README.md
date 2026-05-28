# Changesets

本项目使用 Changesets 管理 `moe-cute-ui` 的版本更新、changelog 和 CI 发版。

## 日常开发

有需要进入 changelog 的变更时执行：

```bash
pnpm changeset
```

选择 `moe-cute-ui`，再选择 `patch` / `minor` / `major`，并填写变更说明。

该命令只会生成 `.changeset/*.md`，不会修改版本号，也不会打 tag。

## CI 版发版流程

本项目推荐把 `changeset version`、打 tag、GitHub Release 和 npm publish 交给 `.github/workflows/release.yml`。

日常开发只需要提交功能代码和 changeset：

```bash
pnpm changeset
git add -A
git commit -m "feat: xxx"
git push
```

然后在 GitHub Actions 手动运行 `Release` workflow：

```txt
mode: version-and-publish
confirm: release
```

CI 会自动执行：

```txt
1. 检查是否存在 .changeset/*.md
2. pnpm version-packages
3. 读取 packages/core/package.json 中的新版本
4. 运行测试、构建、文档构建和 pack 检查
5. npm publish dry-run
6. 提交版本号和 CHANGELOG 变更
7. npm publish --provenance
8. 创建并推送 v{version} tag
9. 创建 GitHub Release
```

## 首次发布或补发当前版本

如果版本号已经在代码里改好，并且没有待消费 changeset，可以运行 `Release` workflow：

```txt
mode: publish-current
confirm: release
```

该模式不会执行 `pnpm version-packages`，会直接发布当前 `packages/core/package.json` 中的版本，并在发布成功后创建 tag 和 GitHub Release。

## 发布前本地检查

```bash
pnpm publish:dry
```

该命令会执行测试、构建、文档构建、pack 检查和 npm publish dry-run。

## npm Trusted Publishing

发布使用 npm Trusted Publishing：GitHub Actions 通过 OIDC 获取短期发布身份，不需要长期 `NPM_TOKEN`。

需要在 npm 包 `moe-cute-ui` 的 Trusted Publishing 设置中添加 GitHub Actions publisher：

```txt
Repository: <owner>/<repo>
Workflow: .github/workflows/release.yml
Environment: 留空，除非 workflow 中显式配置 environment
```
