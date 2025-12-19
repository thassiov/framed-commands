package picker

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"strings"

	fuzzyfinder "github.com/ktr0731/go-fuzzyfinder"
	"github.com/thassiov/framed-commands/internal/command"
)

// Pick prompts the user to select a command
// Tries fzf first, falls back to built-in fuzzy finder
func Pick(commands []*command.Command) (*command.Command, error) {
	if hasFzf() {
		return pickWithFzf(commands)
	}
	return pickWithBuiltin(commands)
}

// PickSimple uses a basic numbered list
func PickSimple(commands []*command.Command) (*command.Command, error) {
	fmt.Printf("Commands:\n\n")
	for i, cmd := range commands {
		fmt.Printf("  [%d] %s\n", i, cmd.Descriptor.Name)
		if cmd.Descriptor.Description != "" {
			fmt.Printf("      %s\n", cmd.Descriptor.Description)
		}
	}

	fmt.Print("\nEnter number (q to quit): ")
	var input string
	fmt.Scanln(&input)

	if input == "q" || input == "" {
		return nil, nil
	}

	var idx int
	if _, err := fmt.Sscanf(input, "%d", &idx); err != nil {
		return nil, fmt.Errorf("invalid input")
	}

	if idx < 0 || idx >= len(commands) {
		return nil, fmt.Errorf("invalid command index")
	}

	return commands[idx], nil
}

func hasFzf() bool {
	_, err := exec.LookPath("fzf")
	return err == nil
}

func pickWithFzf(commands []*command.Command) (*command.Command, error) {
	fzf := exec.Command("fzf",
		"--height=40%",
		"--layout=reverse",
		"--border",
		"--prompt=command> ",
		"--delimiter=\t",
		"--with-nth=2..", // Display from field 2 onwards (hide ID)
	)

	fzf.Stderr = os.Stderr

	stdin, err := fzf.StdinPipe()
	if err != nil {
		return nil, fmt.Errorf("fzf stdin: %w", err)
	}

	stdout, err := fzf.StdoutPipe()
	if err != nil {
		return nil, fmt.Errorf("fzf stdout: %w", err)
	}

	if err := fzf.Start(); err != nil {
		return nil, fmt.Errorf("fzf start: %w", err)
	}

	// Write: ID<tab>Name<tab>Description
	for _, cmd := range commands {
		line := fmt.Sprintf("%s\t%s\t%s", cmd.ID, cmd.Descriptor.Name, cmd.Descriptor.Description)
		fmt.Fprintln(stdin, line)
	}
	stdin.Close()

	// Read selection
	scanner := bufio.NewScanner(stdout)
	var selection string
	if scanner.Scan() {
		selection = scanner.Text()
	}

	if err := fzf.Wait(); err != nil {
		// User cancelled (Ctrl+C or Esc)
		return nil, nil
	}

	if selection == "" {
		return nil, nil
	}

	// Extract ID (first field)
	id := strings.Split(selection, "\t")[0]
	for _, cmd := range commands {
		if cmd.ID == id {
			return cmd, nil
		}
	}

	return nil, fmt.Errorf("command not found")
}

func pickWithBuiltin(commands []*command.Command) (*command.Command, error) {
	idx, err := fuzzyfinder.Find(
		commands,
		func(i int) string {
			return commands[i].Descriptor.Name
		},
		fuzzyfinder.WithPreviewWindow(func(i, w, h int) string {
			if i == -1 {
				return ""
			}
			cmd := commands[i]
			return fmt.Sprintf(
				"Name: %s\nCommand: %s %s\n\n%s",
				cmd.Descriptor.Name,
				cmd.Descriptor.Command,
				strings.Join(cmd.Descriptor.Args, " "),
				cmd.Descriptor.Description,
			)
		}),
	)

	if err != nil {
		if err == fuzzyfinder.ErrAbort {
			return nil, nil // User cancelled
		}
		return nil, err
	}

	return commands[idx], nil
}
