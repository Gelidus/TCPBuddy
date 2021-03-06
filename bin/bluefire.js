#!/usr/bin/env node

(function() {
  var FileSystem, Git, call, commandTable, commands, parseArguments, path, switches, _ref;

  Git = require("machinepack-git");


  /*
   Parses given array of input arguments and recognizes commands,
   subcommands and switches with their values

   @param [argv] argument list to parse
   @return [ Array, Object] An array of commands and object of switches
   */

  parseArguments = function(argv) {
    var commands, i, skip, switches, y, _i, _j, _ref, _ref1;
    commands = [];
    switches = {};
    for (y = _i = 0, _ref = argv.length; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
      if (argv[y].trim()[0] === '-') {
        break;
      }
      commands.push(argv[y].trim());
    }
    skip = false;
    for (i = _j = y, _ref1 = argv.length; y <= _ref1 ? _j < _ref1 : _j > _ref1; i = y <= _ref1 ? ++_j : --_j) {
      if (skip) {
        skip = false;
        continue;
      }
      if (i + 1 < argv.length && argv[i + 1].trim()[0] !== '-') {
        switches[argv[i]] = argv[i + 1];
        skip = true;
      } else {
        switches[argv[i]] = null;
      }
    }
    return [commands, switches];
  };

  FileSystem = require("fs");

  path = process.cwd();

  _ref = parseArguments(process.argv.slice(2)), commands = _ref[0], switches = _ref[1];

  commandTable = {
    'new': function(commands, switches) {
      var name, projectPath;
      name = commands[0];
      projectPath = "" + path + "/" + name;
      console.log(">> Creating bluefire applicaiton inside " + projectPath);
      if (FileSystem.existsSync(projectPath) === true) {
        console.log(">> Given folder already exists!");
        return;
      }
      return Git.clone({
        dir: projectPath,
        remote: 'https://github.com/Gelidus/bluefire-generated-project.git'
      }).exec({
        error: function(err) {
          return console.log(">> We could not fetch the data from server " + err);
        },
        success: function(result) {
          return console.log(">> Your project was successfully generated");
        }
      });
    }
  };

  call = function(currentCommand) {
    if (commandTable[commands[currentCommand]] != null) {
      return commandTable[commands[currentCommand]](commands.splice(currentCommand + 1), switches);
    } else {
      return console.log(">> Sorry, no command found named \"" + commands[currentCommand] + "\"");
    }
  };

  call(0);

}).call(this);
