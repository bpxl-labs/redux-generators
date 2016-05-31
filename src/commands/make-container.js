const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const template = require('lodash.template');
const lowercase = require('lodash.tolower');
const kebab = require('lodash.kebabcase');
const utils = require('../utils');
const paths = require('../paths');

program
  .command('make:container <name>')
  .option('--selector [name]', 'Selector for container component', 'testSelector')
  .action((name, options) => {
    const insertPath = path.join(options.parent.root, options.parent.path);
    const fileName = `${lowercase(kebab(name))}.js`;

    console.log(chalk.cyan(`Creating container component "${name}" inside "${fileName}"...`));
    utils.exists(fileName)
      .then(() => utils.exit(`Container component "${name}" already exists.`))
      .catch(() => utils.read(paths.containerStub, 'utf8'))
      .then(content => Promise.resolve(
        template(content)({
          name,
          selector: options.selector,
        })
      ))
      .then(content => utils.write(`${insertPath}/${fileName}`, content))
      .then(() => console.log(chalk.green(
        `Container component ${name} successfully created inside "${fileName}"!`
      )))
      .catch(utils.exit);
  });