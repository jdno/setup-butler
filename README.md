# setup-butler

This action downloads [butler], a command-line tool by [itch.io], and adds it to
the `PATH`.

## Usage

Simply run `setup-butler` in a workflow to add the `butler` command-line tool to
the `PATH`:

```yaml
steps:
  - name: Set up butler
    uses: jdno/setup-butler@v1

  - name: Print butler version
    run: butler -V
```

## Configuration

The behavior of `setup-butler` can be customized with these settings.

| Parameter | Description           | Default  |
| --------- | --------------------- | -------- |
| `version` | The version of butler | `latest` |

### `version`

The `version` parameter can be used to set the version of butler that gets
installed.

```yaml
steps:
  - name: Set up butler
    uses: jdno/setup-butler@v1
    with:
      version: 15.20.0
```

If the `version` is not specified, the latest version will be installed.

## Code of Conduct

👋 This is a welcoming and inclusive project. Be nice and follow our
[code of conduct](./CODE_OF_CONDUCT.md).

## License

This project is released under the terms of the [MIT License](./LICENSE).

[butler]: https://itch.io/docs/butler/
[itch.io]: https://itch.io/
