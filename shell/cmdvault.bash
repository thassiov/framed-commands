# cmdvault bash completion
# Source this file or add to your .bashrc:
#   source /path/to/cmdvault/shell/cmdvault.bash

_cmdvault_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"

    # First argument after cmdvault: complete aliases
    if [[ ${COMP_CWORD} -eq 1 ]]; then
        local aliases=$(cmdvault --list-aliases 2>/dev/null)
        COMPREPLY=($(compgen -W "${aliases}" -- "${cur}"))
    else
        # After alias: complete files (for placeholder args)
        COMPREPLY=($(compgen -f -- "${cur}"))
    fi
}

complete -F _cmdvault_completions cmdvault
