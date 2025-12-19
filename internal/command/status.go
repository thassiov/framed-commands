package command

type Status int

const (
	StatusIdle Status = iota
	StatusRunning
	StatusStopped
	StatusFinished
	StatusError
)

func (s Status) String() string {
	switch s {
	case StatusIdle:
		return "idle"
	case StatusRunning:
		return "running"
	case StatusStopped:
		return "stopped"
	case StatusFinished:
		return "finished"
	case StatusError:
		return "error"
	default:
		return "unknown"
	}
}
