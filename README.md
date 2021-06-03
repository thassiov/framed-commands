<div align="center">
  <img src="tuizer-demo.gif">
  <h5>Make a TUI app using a json file</h5>
</div>


# tuizer

## Install

```bash
npm install -g tuizer
```

## What is does

From a json file, it creates a menu where you can execute commands. A small description of the command is also shown, if provided.

<details><summary>Why (the motivation behind it)</summary>

I don't remember all the possible commands from an application and I didn't wanted to keep trying to dig through documentation to find the correct combination of options to do a certain operation. Also I didn't want to created a lot of custom scripts to do those things, like having a script that does `ls -la` alone, for instance.

If I find a command that I want to use, but don't do it very often and don't want to lose it, or I want to study some application, like terraform or some other thing that has a bunch of different commands, I would want something like this available: feed a json file with the stuff you don't want to lose (commands and their descriptions) and the app will create a little menu for you.

</details>

## How it words

You run `tuizer` and provide a `json` file with your commands. A list will be generated and you can chose and selec any command to run.

```bash
tuizer ls-related-commands.json
```

## The JSON file

```json
{
  "name":"Commands I am learning",
  "commands": [
    {
      "command": "ls",
      "parameters": ["-la"],
      "description": "display extended file metadata as a table (-l) and show hidden and 'dot' files (-a)",
      "nameAlias": "extended list, including hidden"
    },
    {
      "command": "cat",
      "parameters": ["/etc/hostname"],
      "description": "display the contents of /etc/hostname file",
      "nameAlias": "show the hostname"
    },
    {
      "command": "sleep",
      "parameters": ["3s"],
      "description": "sleep for 3 seconds",
      "nameAlias": "sleep 3s"
    },
    {
      "command": "curl",
      "parameters": ["--verbose","google.com"],
      "description": "get google's web page in verbose mode",
      "nameAlias": "get googles' page"
    },
    {
      "command": "yay",
      "parameters": ["-Ss","pulseaudio"],
      "description": "for some reason search for pulseaudio at aur",
      "nameAlias": "yay search pulseaudio"
    },
    {
      "command": "ip",
      "parameters": ["addr"],
      "description": "Shows addresses assigned to all network interfaces",
      "nameAlias": "Describe network interfaces"
    }
  ]
}
```

## License

[MIT](LICENSE)
