# hackium

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

Just used to do something cool in cli...
[ NOTE: Please Don't use it For Any illegal purposes, if you use it then I don't care its not my responsiblity ]

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine being cool. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

```
Nodejs - From their website
NPM - From their website
```

### Installing <a name = "deployment"></a>

A step by step series of examples that tell you how to get the app running.

```
Go to the project directory
npm install
npm install -g .
```

Now set the Envirnment variable of your system
```
HACKIUM_APP_PATH = YOURPATH (without last "/")
```

```
hackium --help
```


## Usage <a name = "usage"></a>

Help command
```
hackium --help
```

Help for specific command
```
hackium --help bins
```

Example of generating and validating bins
```
hackium bins generate --save
hackium bins validate --save
```

Example of generating and validating cards
```
hackium cards generate --save
hackium cards validate --save
```


