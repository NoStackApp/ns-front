import {dirOptions} from '../constants/dirOptions'
import {getConfiguration} from '../constants/getConfiguration'
import {AppInfo, CommandSpec, Configuration, CustomCodeRepository} from '../constants/types'

import {getAppDir} from '../inputs/getAppDir'
import {errorMessage} from '../constants/errorMessage'

const chalk = require('chalk')
const execa = require('execa')
const fs = require('fs-extra')
const Listr = require('listr')
const yaml = require('js-yaml')

const LOGFILE = 'noStackLog.txt'

function convertCommandArgs(args: string[]|undefined, appDir: string) {
  if (!args) return
  // const output = args.map((arg: string) => arg.replace('$appDir', appDir)).push(`>> ${LOGFILE}`)
  const output = args.map((arg: string) => arg.replace('$appDir', appDir))
  output.push(`>> ${LOGFILE}`)
  return output
}

export async function createPlaceholderApp(
  appDir: string,
  baseApp: string,
  templateDir: string,
) {
  const config: Configuration = await getConfiguration(templateDir)
  const {placeholderAppCreation} = config
  const {mainInstallation, devInstallation, preCommands} = placeholderAppCreation

  // if (preCommands) {
  //   console.log(`preCommands=${JSON.stringify(preCommands)}`)
  //   console.log(`preCommands[0].arguments=${JSON.stringify(preCommands[0].arguments)}`)
  //   console.log(`preCommands[0].arguments converted=${JSON.stringify(convertCommandArgs(preCommands[0].arguments, appDir))}`)
  // }

  if (baseApp) {
    const tasksCopyFromBaseApp = new Listr([
      {
        title: 'Check for baseApp',
        task: async () => {
          const isBaseApp = await fs.pathExists(baseApp)

          if (!isBaseApp) {
            throw new Error(errorMessage(`the folder for ${baseApp} does not exist. Please confirm it or create it separately`))
          }
        },
      },
      {
        title: 'Copy directory to new app directory',
        task: async () => {
          const finalAppDir = await getAppDir(appDir) || ''

          await execa(
            'cp',
            ['-r', baseApp, finalAppDir],
          ).catch(
            (error: any) => {
              throw new Error(`${chalk.red(`error copying over from ${baseApp}.`)} Here is the error reported:\n${error}`)
            },
          )
        },
      },
    ])
    return tasksCopyFromBaseApp
  }

  const tasksFullInstallation = new Listr([
    {
      title: 'Create App Directory',
      task: async () => {
        const isAppFolder = await fs.pathExists(appDir)

        if (isAppFolder) {
          throw new Error(errorMessage(`a folder for ${appDir} already exists. Please choose a different app name`))
        }

        const upperCaseCheck = /(.*[A-Z].*)/
        if (upperCaseCheck.test(appDir)) {
          throw new Error(errorMessage(`The ${appDir} contains at least one capital, which create-react-app does not permit.`))
        }
      },
    },
    {
      title: 'Execute Pre-Commands',
      task: async () => {
        if (!preCommands) return
        return new Listr(preCommands.map((commandSpec: CommandSpec) => {
          return {
            title: commandSpec.title,
            task: async () => {
              await execa(
                commandSpec.file,
                convertCommandArgs(commandSpec.arguments, appDir),
                commandSpec.options,
              ).catch(
                (error: any) => {
                  throw new Error(`${chalk.red(`error with pre-command ${commandSpec.title}.`)}
Here is the information about the command: ${JSON.stringify(commandSpec, null, 1)}
You may try contacting the author of your template to see what they suggest.
Here is the error reported:\n${error}`)
                },
              )
            },
          }
        },
        ))
      },
    },
    {
      title: 'Install General Packages...',
      task: async () => {
        if (!mainInstallation) return
        return new Listr(mainInstallation.map((item: string) => {
          return {
            title: item,
            task: async () => {
              await execa(
                'npm',
                ['install', '--prefix', appDir, '--save', item],
              ).catch(
                (error: any) => {
                  throw new Error(`${chalk.red(`error installing ${item}.`)} You may try installing ${item} directly by running 'npm install --save ${item}' directly and see what messages are reported. Here is the error reported:\n${error}`)
                },
              )
            },
          }
        },
        ))
      },
    },
    {
      title: 'Install Dev Packages...',
      task: async () => {
        if (!devInstallation) return
        return new Listr(devInstallation.map((item: string) => {
          return {
            title: item,
            task: async () => {
              await execa(
                'npm',
                ['install', '--prefix', appDir, '--save-dev', item],
              ).catch(
                (error: any) => {
                  throw new Error(`${chalk.red(`error installing ${item}.`)} You may try installing ${item} directly by running 'npm install --save ${item}' directly and see what messages are reported. Here is the error reported:\n${error}`)
                },
              )
            },
          }
        },
        ))
      },
    },
    // {
    //   title: 'Add Linting Dot Files',
    //   task: async () => {
    //     try {
    //       await createDotFiles(appDir)
    //     } catch (err) {
    //       throw new Error('error in creating a NoStack app')
    //     }
    //   },
    // },
    // {
    //   title: 'Confirm Installation',
    //   task: async () => {
    //     // shell.exec(`npx create-react-app ${appDir} >> ${LOGFILE}`)
    //
    //     const noStackFile = `${appDir}/node_modules/@nostack/no-stack/dist/no-stack.esm.js`
    //     const isNoStackFile = await fs.pathExists(noStackFile)
    //
    //     if (!isNoStackFile) {
    //       throw new Error(errorMessage('no-stack did not install properly.'))
    //     }
    //   },
    // },
    {
      title: 'Add Meta-Data',
      task: async () => {
        const metaDir = `${appDir}/meta`
        const appYaml = `${metaDir}/app.yml`
        const customCode = `${metaDir}/addedCode.json`
        const appInfo: AppInfo = {
          appName: 'myApp',
          template: templateDir,
          userClass: 'user',
          units: {
            unit1: {
              hierarchy: {
                type1: null,
              },
            },
          },
          topUnits: [
            'unit1',
          ],
        }
        const customCodeRepository: CustomCodeRepository = {
          addedCode: {},
          replacedCode: {},
          removedCode: {},
        }

        try {
          await fs.ensureDir(metaDir, dirOptions)
          await fs.outputFile(appYaml, yaml.safeDump(appInfo))
          await fs.outputJson(customCode, customCodeRepository)
          // console.log('success creating dirs')
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        }
      },
    },
  ])

  return tasksFullInstallation
  // logProgress(`${chalk.green('Installation is complete!')} Run the other utilities to create the full app`)
}
