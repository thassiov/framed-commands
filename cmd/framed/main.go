package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/thassiov/framed-commands/internal/command"
	"github.com/thassiov/framed-commands/internal/loader"
	"github.com/thassiov/framed-commands/internal/orchestrator"
	"github.com/thassiov/framed-commands/internal/picker"
)

func main() {
	filePath := flag.String("f", "", "path to command file or directory")
	simple := flag.Bool("simple", false, "use simple numbered list instead of fuzzy finder")
	flag.Parse()

	l, err := loader.New()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	commands, err := l.Load(*filePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error loading commands: %v\n", err)
		os.Exit(1)
	}

	if len(commands) == 0 {
		fmt.Println("no commands found")
		os.Exit(0)
	}

	orch := orchestrator.New()
	orch.LoadFromDescriptors(commands)

	cmdList := orch.List()

	var selected *command.Command
	if *simple {
		selected, err = picker.PickSimple(cmdList)
	} else {
		selected, err = picker.Pick(cmdList)
	}

	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	if selected == nil {
		os.Exit(0)
	}

	fmt.Printf("\nRunning: %s %v\n", selected.Descriptor.Command, selected.Descriptor.Args)
	fmt.Println(strings.Repeat("-", 40))

	if err := selected.Start(context.Background()); err != nil {
		fmt.Fprintf(os.Stderr, "error starting command: %v\n", err)
		os.Exit(1)
	}

	for out := range selected.Output {
		fmt.Println(out.Content)
	}

	fmt.Println(strings.Repeat("-", 40))
	fmt.Printf("Exit code: %d\n", *selected.ExitCode)
}
