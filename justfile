# Run all recipes inside the Flox environment
set shell := ["flox", "activate", "--", "sh", "-cu"]

[private]
default:
    @just --list

# Install the JavaScript dependencies, unless node_modules is already up to date
# with the lockfile. Recipes that need the dependencies depend on this one.
[private]
install:
    [ node_modules/.package-lock.json -nt package-lock.json ] || npm ci

[private]
pre-commit-checks: pre-commit-fix pre-commit-verify

# Every recipe that rewrites the working tree, in sequence: they overlap each
# other, and nothing may read a file while one of them is writing it. The
# formatters run before the build so that dist/ is derived from formatted
# sources.
[private]
pre-commit-fix:
    just prettier true
    just build-action

# Every recipe that only reads, in parallel: the tree has stopped changing, so
# what each of them sees is what the commit will contain.
[private]
pre-commit-verify:
    #!/usr/bin/env -S parallel --shebang --ungroup --jobs {{ num_cpus() }}
    just lint-github-actions
    just lint-markdown
    just lint-typescript
    just lint-yaml
    just test-typescript

# Build the action into a single file in dist/
build-action: install
    npx tsc && npx ncc build --minify

# Check that the action in dist/ is up to date with the sources
check-action: build-action
    git diff --exit-code --stat --ignore-space-at-eol -- dist/ || { echo "dist/ is out of date. Run 'just build-action' and commit the result."; exit 1; }

# Format JSON files
format-json fix="false": (prettier fix "{json,json5}")

# Format Markdown files
format-markdown fix="false": (prettier fix "md")

# Format TypeScript and JavaScript files
format-typescript fix="false": (prettier fix "{ts,js,mjs,cjs}")

# Format YAML files
format-yaml fix="false": (prettier fix "{yaml,yml}")

# Lint GitHub Actions workflows
lint-github-actions:
    zizmor -p .

# Lint Markdown files
lint-markdown:
    markdownlint "**/*.md"

# Lint TypeScript files
lint-typescript: install
    npx eslint "**/*.ts"

# Lint YAML files
lint-yaml:
    yamllint .

# Run a subset of checks as pre-commit hooks
pre-commit:
    @just pre-commit-checks

# Auto-format files with prettier
prettier fix="false" extension="*":
    prettier {{ if fix == "true" { "--write" } else { "--list-different" } }} --ignore-unknown "**/*.{{ extension }}"

# Run the tests
test-typescript: install
    npx jest
