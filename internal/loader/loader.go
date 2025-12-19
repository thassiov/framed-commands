package loader

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/thassiov/framed-commands/internal/command"
	"gopkg.in/yaml.v3"
)

const (
	DefaultConfigDir  = ".config/framed"
	DefaultCommandDir = "commands"
)

// CommandFile represents the structure of a YAML command file
type CommandFile struct {
	// Optional metadata for the file
	Name        string               `yaml:"name,omitempty"`
	Description string               `yaml:"description,omitempty"`
	Commands    []command.Descriptor `yaml:"commands"`
}

// Loader handles loading command files
type Loader struct {
	commandsDir string
}

// New creates a loader with default paths (~/.config/framed/commands)
func New() (*Loader, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("get home dir: %w", err)
	}

	return &Loader{
		commandsDir: filepath.Join(home, DefaultConfigDir, DefaultCommandDir),
	}, nil
}

// NewWithPath creates a loader with a custom commands directory
func NewWithPath(commandsDir string) *Loader {
	return &Loader{
		commandsDir: commandsDir,
	}
}

// LoadFile loads commands from a specific YAML file
func (l *Loader) LoadFile(path string) ([]command.Descriptor, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read file %s: %w", path, err)
	}

	var cf CommandFile
	if err := yaml.Unmarshal(data, &cf); err != nil {
		return nil, fmt.Errorf("parse yaml %s: %w", path, err)
	}

	// Tag each command with its source file for debugging
	for i := range cf.Commands {
		if cf.Commands[i].Name == "" {
			cf.Commands[i].Name = fmt.Sprintf("%s#%d", filepath.Base(path), i)
		}
	}

	return cf.Commands, nil
}

// LoadDir loads all YAML files from the commands directory
func (l *Loader) LoadDir() ([]command.Descriptor, error) {
	return l.LoadDirFrom(l.commandsDir)
}

// LoadDirFrom loads all YAML files from a specific directory
func (l *Loader) LoadDirFrom(dir string) ([]command.Descriptor, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, fmt.Errorf("commands directory does not exist: %s", dir)
		}
		return nil, fmt.Errorf("read dir %s: %w", dir, err)
	}

	var allCommands []command.Descriptor

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		name := entry.Name()
		if !isYAMLFile(name) {
			continue
		}

		path := filepath.Join(dir, name)
		commands, err := l.LoadFile(path)
		if err != nil {
			// Log warning but continue loading other files
			fmt.Fprintf(os.Stderr, "warning: failed to load %s: %v\n", path, err)
			continue
		}

		allCommands = append(allCommands, commands...)
	}

	return allCommands, nil
}

// Load is the main entry point - loads from file if provided, otherwise from default dir
func (l *Loader) Load(filePath string) ([]command.Descriptor, error) {
	if filePath != "" {
		// Check if it's a file or directory
		info, err := os.Stat(filePath)
		if err != nil {
			return nil, fmt.Errorf("stat %s: %w", filePath, err)
		}

		if info.IsDir() {
			return l.LoadDirFrom(filePath)
		}
		return l.LoadFile(filePath)
	}

	return l.LoadDir()
}

// EnsureDefaultDirs creates the default config directories if they don't exist
func (l *Loader) EnsureDefaultDirs() error {
	if err := os.MkdirAll(l.commandsDir, 0755); err != nil {
		return fmt.Errorf("create commands dir: %w", err)
	}
	return nil
}

// DefaultDirExists checks if the default commands directory exists
func (l *Loader) DefaultDirExists() bool {
	_, err := os.Stat(l.commandsDir)
	return err == nil
}

// GetCommandsDir returns the commands directory path
func (l *Loader) GetCommandsDir() string {
	return l.commandsDir
}

func isYAMLFile(name string) bool {
	lower := strings.ToLower(name)
	return strings.HasSuffix(lower, ".yaml") || strings.HasSuffix(lower, ".yml")
}
