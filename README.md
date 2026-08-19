# setup-butler

This action downloads [butler], a command-line tool by [itch.io], and adds it to
the `PATH`.

## Usage

Simply run `setup-butler` in a workflow to add the `butler` command-line tool to
the `PATH`:

```yaml
steps:
  - name: Set up butler
    uses: jdno/setup-butler@v2.0.0

  - name: Print butler version
    run: butler -V
```

## Configuration

The behavior of `setup-butler` can be customized with these settings.

| Parameter      | Description                | Default                   |
| -------------- | -------------------------- | ------------------------- |
| `architecture` | The architecture of butler | The runner's architecture |
| `version`      | The version of butler      | `latest`                  |

### `architecture`

The `architecture` parameter can be used to install a butler build for a
different architecture than the runner's, for example the `amd64` build on an
`arm64` runner. Supported values are `amd64` and `arm64`.

```yaml
steps:
  - name: Set up butler
    uses: jdno/setup-butler@v2.0.0
    with:
      architecture: amd64
```

If the `architecture` is not specified, the architecture of the runner will be
used.

### `version`

The `version` parameter can be used to set the version of butler that gets
installed.

```yaml
steps:
  - name: Set up butler
    uses: jdno/setup-butler@v2.0.0
    with:
      version: 15.20.0
```

If the `version` is not specified, the latest version will be installed.

## Supported Platforms

butler is available for the following platforms and architectures. The `arm64`
builds are available starting with butler 15.25.0.

| Platform | `amd64` | `arm64` |
| -------- | ------- | ------- |
| Linux    | Yes     | Yes     |
| macOS    | Yes     | Yes     |
| Windows  | Yes     | No      |

## Code of Conduct

👋 This is a welcoming and inclusive project. Be nice and follow our
[code of conduct](./CODE_OF_CONDUCT.md).

## Acknowledgments

The implementation of this action is inspired by
[actions/setup-node](https://github.com/actions/setup-node) and
[bufbuild/buf-setup-action](https://github.com/bufbuild/buf-setup-action).

## License

This project is released under the terms of the [MIT License](./LICENSE).

[butler]: https://itch.io/docs/butler/
[itch.io]: https://itch.io/
