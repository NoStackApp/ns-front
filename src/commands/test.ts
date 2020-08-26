import {Command, flags} from '@oclif/command'
import {isRequired} from '../isRequired'

const fs   = require('fs-extra')
const inflection = require('inflection')
const yaml = require('js-yaml')

import {generateTestCode} from '../codeGeneration/generateTestCode'
import {insertAddedCode} from '../codeGeneration/insertAddedCode'
import {storeAddedCode} from '../codeGeneration/storeAddedCode'
import {AppInfo} from '../constants/types'
import execa = require('execa');

const frontEndRulesDoc = 'https://bit.ly/nsFrontEndRules'

export default class Test extends Command {
  static description = String(
    'test lets you confirm that your code is not violating any' +
    'of the rules for testing required by nostack.  For documentation about those ' +
    'rules, please see ' + frontEndRulesDoc + '.' +
    '  This is actually one of the tests conducted by NoStack to gauge the quality of ' +
    'submitted code.  Essentially, the test generates a new version of the code and' +
    'then simply compares it against your current version.  If there are differences, ' +
    'then there is a problem with your code.')

  static examples = [
    '$ nsfront test -a ~/temp/myApp',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    appDir: flags.string({char: 'a', description: 'application directory'}),
  }

  static args = []

  async run() {
    const {flags} = this.parse(Test)
    const appDir = flags.appDir || isRequired('appDir', 'makecode', 'a')

    const docsDir = `${appDir}/docs`
    const appFile = `${docsDir}/app.yml`

    const jsonPath = `${docsDir}/stack.json`

    let appParams: AppInfo
    try {
      const appYaml = fs.readFileSync(appFile, 'utf8')
      appParams = await yaml.safeLoad(appYaml)
    } catch (error) {
      throw error
    }

    const {appName, userClass, units} = appParams

    // store added code before generating new code.
    console.log(`about to call storeAddedCode(${appDir})`)
    await storeAddedCode(appDir)

    console.log(`about generateAppCode(${appDir})`)
    console.log(`data:(${appName},${userClass}, ${jsonPath})`)
    const testDir = `${appDir}.test`

    try {
      await fs.remove(testDir)
      await fs.ensureDir(`${testDir}/src`)
      await fs.copy(`${appDir}/src/components`, `${testDir}/src/components`)
      await generateTestCode(testDir, userClass, jsonPath, appName)
    } catch (error) {
      throw error
    }

    console.log(`about to insertAddedCode(${testDir})`)
    const addedCodeDoc = `${docsDir}/addedCode.json`
    await insertAddedCode(testDir, addedCodeDoc)

    const originalComps = `${appDir}/src/components`
    const generatedComps = `${testDir}/src/components`
    const diffsDir = `${testDir}/diffs`
    const diffsFile = `${testDir}/diffs`

    console.log(`diffsFile = ${diffsFile}`)
    try {
      fs.ensureDir(diffsDir)
      units.map((unit: string) => {
        console.log(`in ${unit}`)
        const diffsFile = `${diffsDir}/${unit}`
        console.log(`diffsFile = ${diffsFile}`)
        const originalUnit = `${originalComps}/${unit}`
        const generatedUnit = `${generatedComps}/${unit}`
        const subprocess = execa('diff', ['-rbBw', originalUnit, generatedUnit])
        subprocess.stdout.pipe(fs.createWriteStream(diffsFile))
      })
    } catch (error) {
      console.log('error running diff')
      throw error
    }
    console.log(`done running the test. To see any issues, you can look
in the directory ${diffsDir}.  Any diff shown is a problem.
    If it's empty, then your code satisfies the no-stack requirement for
    being regenerable.  If not, see ${frontEndRulesDoc} for more info.`)
  }
}
