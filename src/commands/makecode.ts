// const errorEx = require('error-ex')
// const fs = require('fs-extra')

import {Command, flags} from '@oclif/command'

import {generateAppCode} from '../codeGeneration/generateAppCode'
import {insertAddedCode} from '../codeGeneration/insertAddedCode'
import {storeAddedCode} from '../codeGeneration/storeAddedCode'
import {getAppInfo} from '../constants/getAppInfo'
// import {StackInfo} from '../constants/types'
// import {getAppName} from '../inputs/getAppName'
import {isRequired} from '../inputs/isRequired'

// export const NoNameError = errorEx('noNameError')

export default class Makecode extends Command {
  static description = 'generates or updates code from a template, preserving custom changes.' +
    ' The app directory should have been prepared the first time with a call to `newapp`'

  static examples = [
    '$ nostack makecode -a ~/temp/myapp',
  ]

  static flags = {
    appDir: flags.string({char: 'a', description: 'application directory'}),
    help: flags.help({char: 'h'}),
  }

  static args = []

  async run() {
    // const {args, flags} = this.parse(Makecode)
    const {flags} = this.parse(Makecode)

    const appDir = flags.appDir || isRequired('appDir', 'makecode', 'a')

    // store added code before generating new code.
    await storeAddedCode(appDir)

    const metaDir = `${appDir}/meta`
    const appFile = `${metaDir}/app.yml`
    const jsonPath = `${metaDir}/stack.json`
    const appInfo = await getAppInfo(appFile)
    this.log(`about generateAppCode(${appDir})`)
    await generateAppCode(appDir, appInfo, jsonPath)

    this.log(`about to insertAddedCode(${appDir})`)
    const addedCodeDoc = `${metaDir}/addedCode.json`
    await insertAddedCode(appDir, addedCodeDoc)
  }
}
