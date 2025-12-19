# Roadmap

## Planned

### Shell Integration
- [ ] Add `--print` flag to output command instead of running it
- [ ] Add `--insert` flag for cursor insertion mode
- [ ] Add `--copy` flag to copy command to clipboard
- [ ] Create `shell/framed.zsh` integration script
- [ ] Support keybinding (e.g., Ctrl+F) via ZLE widget
- [ ] Support leader key sequences (e.g., Ctrl+X then f)
- [ ] Bash integration (`shell/framed.bash`)
- [ ] Fish integration (`shell/framed.fish`)

### Commands
- [ ] User input parameters (prompt for values at runtime)
- [ ] Command groups/categories
- [ ] Command history tracking
- [ ] Favorite/pinned commands

### UI/UX
- [ ] Preview pane in fzf showing full command details
- [ ] Color-coded output (stdout vs stderr)
- [ ] Interactive mode (run multiple commands in a session)

### Configuration
- [ ] Global config file (`~/.config/framed/config.yaml`)
- [ ] Custom fzf options
- [ ] Custom keybindings for builtin picker
- [ ] Themes

### Distribution
- [ ] Homebrew formula
- [ ] AUR package
- [ ] Pre-built binaries for releases
