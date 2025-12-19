# Roadmap

## Planned

### Shell Integration
- [ ] Add `--print` flag to output command instead of running it
- [ ] Add `--insert` flag for cursor insertion mode
- [ ] Add `--copy` flag to copy command to clipboard
- [ ] Create `shell/cmdvault.zsh` integration script
- [ ] Support keybinding (e.g., Ctrl+F) via ZLE widget
- [ ] Support leader key sequences (e.g., Ctrl+X then f)
- [ ] Bash integration (`shell/cmdvault.bash`)
- [ ] Fish integration (`shell/cmdvault.fish`)

### Commands
- [ ] User input parameters (prompt for values at runtime)
- [ ] Command groups/categories
- [ ] Command history tracking
- [ ] Favorite/pinned commands

### Output
- [ ] `--save-output` flag to save command output to file
- [ ] Auto-save output to `~/.config/cmdvault/logs/`
- [ ] Handle pagers/TUI programs (less, vim, htop, etc.) - needs research

### UI/UX
- [ ] Preview pane in fzf showing full command details
- [ ] Color-coded output (stdout vs stderr)
- [ ] Interactive mode (run multiple commands in a session)

### Configuration
- [ ] Global config file (`~/.config/cmdvault/config.yaml`)
- [ ] Custom fzf options
- [ ] Custom keybindings for builtin picker
- [ ] Themes

### Distribution
- [ ] Homebrew formula
- [ ] AUR package
- [ ] Pre-built binaries for releases
