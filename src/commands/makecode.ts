// const errorEx = require('error-ex')
const fs = require('fs-extra')

import {Command, flags} from '@oclif/command'

// import {generateAppCode} from '../codeGeneration/generateAppCode'
import {insertAddedCode} from '../codeGeneration/insertAddedCode'
import {storeAddedCode} from '../codeGeneration/storeAddedCode'
import {StackInfo} from '../constants/types'
// import {getAppName} from '../inputs/getAppName'
import {isRequired} from '../inputs/isRequired'

// export const NoNameError = errorEx('noNameError')

export default class Makecode extends Command {
  static description = 'generates a starter app from a json provided by NoStack'

  static examples = [
    '$ nostack makecode -a ~/temp/myapp -j ~/temp/stack.json -c buyer',
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
    this.log(`doesn't do a thing! (${appDir})`)
    // await storeAddedCode(appDir)

    // console.log(`about generateAppCode(${appDir})`)
    // const generateAppTasks = await generateAppCode(appDir, userClass, jsonPath, appName)
    // await generateAppTasks.run().catch((err: any) => {
    //   throw err
    // })
    //
    // console.log(`about to insertAddedCode(${appDir})`)
    // await insertAddedCode(appDir)
  }
}
