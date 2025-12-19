# cmdvault

A command-line tool to store, organize, and quickly run your frequently used commands.

Instead of memorizing complex CLI commands or cluttering your shell config with aliases, define them in YAML files and access them through a fuzzy finder.

## Install

```bash
go install github.com/thassiov/cmdvault/cmd/cmdvault@latest
```

Or build from source:

```bash
git clone https://github.com/thassiov/cmdvault
cd cmdvault
go build -o cmdvault ./cmd/cmdvault
```

## Usage

```bash
# Run with default directory (~/.config/cmdvault/commands/)
cmdvault

# Run with a specific file
cmdvault -f ~/my-commands.yaml

# Run with a specific directory
cmdvault -f ~/commands/

# Use simple numbered list instead of fuzzy finder
cmdvault --simple

# Run a command directly by alias (skips picker)
cmdvault list-containers
cmdvault prune-system
```

On first run, cmdvault will offer to create the config directory if it doesn't exist.

## Defining Commands

Create YAML files in `~/.config/cmdvault/commands/` (or specify with `-f`):

```yaml
name: Docker Commands
description: Common docker operations

commands:
  - name: list containers
    command: docker
    args: ["ps", "-a"]
    description: Show all containers including stopped ones

  - name: prune system
    command: docker
    args: ["system", "prune", "-f"]
    description: Remove unused containers, networks, and images

  - name: compose up
    command: docker
    args: ["compose", "up", "-d"]
    description: Start services in detached mode
    workdir: /path/to/project
```

### Command Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Display name in the picker |
| `command` | yes | The binary to execute |
| `args` | no | List of arguments |
| `description` | no | Shown in picker and preview |
| `workdir` | no | Working directory for the command |
| `alias` | no | Short name for direct execution (auto-generated from name if not set) |

### Placeholders

Use `{{name}}` placeholders for dynamic arguments:

```yaml
commands:
  - name: start server
    command: ./server
    args: ["--port={{port}}", "--host={{host}}"]
```

```bash
# Provide values positionally (in order of appearance)
cmdvault start-server 8080 localhost
# → ./server --port=8080 --host=localhost

# Partial values - prompts for the rest
cmdvault start-server 8080
# → prompts for "host:", then runs

# No values - prompts for all
cmdvault start-server
# → prompts for "port:", then "host:"

# Pass extra args to the underlying command with --
cmdvault start-server 8080 localhost -- --timeout=5000 -v
# → ./server --port=8080 --host=localhost --timeout=5000 -v
```

### Dynamic Placeholder Sources

Instead of typing values, select from a list using fzf:

```yaml
commands:
  - name: service status
    command: systemctl
    args: ["status", "{{service}}"]
    placeholders:
      service:
        source: "systemctl list-units --type=service --no-legend | awk '{print $1}'"
```

When you run `cmdvault service-status`, it will:
1. Run the source command
2. Pipe output to fzf for selection
3. Use your selection as the placeholder value

## Features

**Fuzzy finder integration**
- Uses `fzf` if available (respects your fzf config)
- Falls back to built-in fuzzy finder with preview pane

**Execution history**
- Logs all runs to `~/.config/cmdvault/history.jsonl`
- Tracks: timestamp, user, command, exit code, duration

**Multiple command files**
- Organize commands by topic (docker.yaml, k8s.yaml, git.yaml)
- All files in the commands directory are loaded together

**Pipeable output**
- When piped, cmdvault outputs only the command's stdout (no decorations)
- `cmdvault my-cmd | grep foo` works as expected

## Examples

See the `examples/` directory for sample command files.

## License

[MIT](LICENSE)
