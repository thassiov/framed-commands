# cmdvault zsh completion
# Source this file or add to your .zshrc:
#   source /path/to/cmdvault/shell/cmdvault.zsh

_cmdvault() {
    local -a aliases

    # Get aliases from cmdvault
    aliases=($(cmdvault --list-aliases 2>/dev/null))

    # First argument: complete aliases
    if (( CURRENT == 2 )); then
        _describe 'alias' aliases
    else
        # After alias: complete files (for placeholder args)
        _files
    fi
}

compdef _cmdvault cmdvault
