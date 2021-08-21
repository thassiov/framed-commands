<div align="center">
  <img src="run-the-sheet-demo.gif">
  <h5>Do you keep cheat sheets of commands? Maybe you can run them with this</h5>
</div>

# run-the-sheet

## Install

```bash
npm install -g run-the-sheet
```

## What is does

From a config file, it creates a menu where you can execute commands. A small description of the command is also shown, if provided.

<details><summary>Why (the motivation behind it)</summary>

I don't remember all the possible commands from an application and I didn't wanted to keep trying to dig through documentation to find the correct combination of options to do a certain operation. Also I didn't want to created a lot of custom scripts to do those things, like having a script that does `ls -la` alone, for instance.

If I find a command that I want to use, but don't do it very often and don't want to lose it, or I want to study some application, like terraform or some other thing that has a bunch of different commands, I would want something like this available: feed a json file with the stuff you don't want to lose (commands and their descriptions) and the app will create a little menu for you.

</details>

## How it works

`run-the-sheet` can be fed a JSON or YAML file directly or, if no file is provided, it searches for the `$HOME/.run-the-sheet` directory for files.

```bash
# the '.json' extension is optional if the format is json
run-the-sheet ./some-json-file.json
run-the-sheet ./some-json-file

or

# the '.yaml' or '.yml' extension is required if the format is yaml
run-the-sheet ./some-yaml-file.yaml

# or

# this will launch a selection menu with the `$HOME/.run-the-sheet`'s content
run-the-sheet

```

Make sure to create the `$HOME/.run-the-sheet` directory and put your configs there if you don't want to provide them as argument everytime.

## The config file

As mentioned, the config can be both a JSON or a YAML file.
The description here only mentions JSON, but an alternative doc will be written later with the YAML structure. At the end of this doc there are a JSON file example and a YAML file example converted from JSON using [json formatter](https://jsonformatter.org/).

### The base structure

```json
{
  "name": "These are the commands I am learning",
  "commands": [<command_structure>]
}
```

The base structure only has 2 properties, one of them optional:

|name |type  |required |
--- | --- | ---
|`name`|string|no|
|`commands`|array of `comand`|yes|


### The `command` structure

```json
{
  "command": "some_command",
  "parameters": [<parameters_structure>],
  "description": "the command's description",
  "nameAlias": "an alias to show in the menu instead of the command (because it might be big)"
},
```

|name |type  |required |
--- | --- | ---
|`comand`|string|yes|
|`parameters`|array of `parameters`|yes|
|`description`|string|yes|
|`nameAlias`|string|yes|

### The `parameters` structure

The `parameters` property can receive two types of elements: `strings` and `input object` structures.

#### The `input object` structure

The idea behind the structure is that there might be commands that need user input to *set parameters*.
This *does not* enable the user to interact with the application run by `run-the-sheet`, but only set the parameters for it to run.

```json
{
  "type":"string",
  "required":true,
  "parameter":"",
  "question":"Enter the cluster's name",
  "defaultValue": "myCluster"
}
```

|name |type  |required |description |
--- | --- | --- | ---
|`type`|only `string` for now|yes|the type of the input|
|`required`|`boolean`|no|input is obligatory|
|`parameter`|`string`|yes|more info in the next section|
|`question`|`string`|yes|the sentence that will appear in the form for this parameter|
|`defaultValue`|`string`|no|if the user does not input anything, this value will be used|

Right now we only have `string` as a type, but in the future there will be `select`, `date`, maybe a `multiSelect`, who knows...😬

##### The `parameter` property

There are two ways to set this property:

- leaving it blank and the parameter will be replaced by the answer given in the form, or
- putting a string with a unescaped `$` in the middle that will be replaced by the answer

The idea of the `$` character is that sometimes the information is in the middle of the string, so if you have a parameter like `--file log.<number>.txt` and you want to change the `<number>` part, you would write it as `--file log.$.txt` in the `parameter` field. The answer given in the form will replace the `$` character.

## Example of a JSON file

Here's how it looks like with all the structures in place (json taken from the project's `example` directory)

```json
{
  "name":"K3D Kubernetes",
  "commands": [
    {
      "command":"k3d",
      "parameters": [
        "cluster",
        "list"
      ],
      "description":"Lists all k3d clusters",
      "nameAlias":"list clusters"
    },
    {
      "command":"k3d",
      "parameters": [
        "cluster",
        "start",
        {
          "type":"string",
          "required":true,
          "parameter":"",
          "question":"Enter the cluster's name",
          "defaultValue": "myCluster"
        }
      ],
      "description":"Starts a named cluster (user input or 'my-cluster' by default)",
      "nameAlias":"starts a named cluster"
    },
    {
      "command":"k3d",
      "parameters": [
        "node",
        "create",
        {
          "type":"string",
          "required":true,
          "parameter":"",
          "question":"Enter the worker node's name",
          "defaultValue": "myWorker"
        },
        "--replicas",
        {
          "type":"string",
          "required":true,
          "parameter":"",
          "question":"Enter the number of replicas of worker nodes",
          "defaultValue": "2"
        },
        "--cluster",
        {
          "type":"string",
          "required":true,
          "parameter":"",
          "question":"Enter the cluster's name",
          "defaultValue": "myCluster"
        }
      ],
      "description":"Adds a number of worker nodes (user input or 2 by default) with a given name (user input or 'myWorker' by default) in a named cluster (user input or 'myCluster' by default)",
      "nameAlias":"adds N named workers in a named cluster"
    }
  ]
}
```

## Example of a YAML file (the same JSON, but converted using [json formatter](https://jsonformatter.org/)).

```yaml
name: K3D Kubernetes
commands:
  - command: k3d
    parameters:
      - cluster
      - list
    description: Lists all k3d clusters
    nameAlias: list clusters
  - command: k3d
    parameters:
      - cluster
      - start
      - type: string
        required: true
        parameter: ''
        question: Enter the cluster's name
        defaultValue: myCluster
    description: Starts a named cluster (user input or 'my-cluster' by default)
    nameAlias: starts a named cluster
  - command: k3d
    parameters:
      - node
      - create
      - type: string
        required: true
        parameter: ''
        question: Enter the worker node's name
        defaultValue: myWorker
      - '--replicas'
      - type: string
        required: true
        parameter: ''
        question: Enter the number of replicas of worker nodes
        defaultValue: '2'
      - '--cluster'
      - type: string
        required: true
        parameter: ''
        question: Enter the cluster's name
        defaultValue: myCluster
    description: >-
      Adds a number of worker nodes (user input or 2 by default) with a given
      name (user input or 'myWorker' by default) in a named cluster (user input
      or 'myCluster' by default)
    nameAlias: adds N named workers in a named cluster
```

## Contributing

Send pull requests, idk

## License

[MIT](LICENSE)
