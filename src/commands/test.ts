import {Command, flags} from '@oclif/command'
import {generateAppCode} from '../codeGeneration/generateAppCode'
import {insertAddedCode} from '../codeGeneration/insertAddedCode'
import {storeAddedCode} from '../codeGeneration/storeAddedCode'
import {getAppInfo} from '../constants/getAppInfo'
import {isRequired} from '../isRequired'
import {checkDirectories} from '../testing/checkDirectories'
import {checkStaticFiles} from '../testing/checkStaticFiles'
import {initializeLogFile} from '../testing/initializeLogFile'
import {logEntry} from '../testing/logEntry'
import {checkGeneratedUnits} from '../testing/checkGeneratedUnits'

const fs = require('fs-extra')

const frontEndRulesDoc = 'https://bit.ly/nsFrontEndRules'

const descriptionString = 'Confirms that your code is not violating any of ' +
'the rules for testing required by nostack.  For documentation about those ' +
'rules, please see ' + frontEndRulesDoc + '.  This is actually one of the tests ' +
'conducted by NoStack to gauge the quality of submitted code.  Essentially, the ' +
'test generates a new version of the code and then simply compares it against ' +
'your current version.  If there are differences, then there is a problem with ' +
'your code.'

export default class Test extends Command {
  static description = String(descriptionString)

  static examples = [
    '$ nsfront test -a ~/temp/myApp',
  ];

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    appDir: flags.string({char: 'a', description: 'application directory'}),
  };

  static args = [];

  async run() {
    const {flags} = this.parse(Test)
    const appDir = flags.appDir || isRequired('appDir', 'makecode', 'a')

    const metaDir = `${appDir}/meta`
    const appFile = `${metaDir}/app.yml`

    // npm version 8 has a known bug with fs-extra...
    const nodeRelease = parseFloat(process.versions.node)
    if (nodeRelease < 9) {
      throw new Error(`Minimum required node version to run ns-front is 9.
        You are currently running node ${process.version}`)
    }

    const appInfo = await getAppInfo(appFile)
    const {units} = appInfo

    // store added code before generating new code.
    await storeAddedCode(appDir)

    const testDir = `${appDir}.test`
    try {
      await fs.remove(testDir)
      await fs.ensureDir(`${testDir}/src/components`)
      // await fs.copy(`${appDir}/src/components`, `${testDir}/src/components`)
      await generateAppCode(testDir, appInfo)
    } catch (error) {
      throw error
    }

    // this.log('*** temporary injected return for testing ***')
    // return // temp
    const addedCodeDoc = `${metaDir}/addedCode.json`
    await insertAddedCode(testDir, addedCodeDoc)

    const originalComps = `${appDir}/src/components`
    const generatedComps = `${testDir}/src/components`
    const diffsDir = `${testDir}/diffs`
    const logFile = `${diffsDir}/tests.log`
    let problemsFound = false

    try {
      fs.ensureDir(diffsDir)
      await initializeLogFile(logFile)

      problemsFound = await checkGeneratedUnits(
        Object.keys(units),
        diffsDir,
        originalComps,
        generatedComps,
        logFile,
        problemsFound,
      )

      problemsFound = await checkStaticFiles(
        diffsDir,
        appDir,
        logFile,
        problemsFound,
      )

      await checkDirectories(appDir, logFile, problemsFound)
    } catch (error) {
      this.error(error)
    }

    let logMessage = `
You will find all files showing discrepancies in the directory ${diffsDir}.
Any discrepancy shown is a problem. See ${frontEndRulesDoc} for more info
about NoStack compatible code.  For specific instructions to resolve
discrepancies, see https://www.npmjs.com/package/ns-front#working-with-test-results. `
    if (problemsFound) {
      this.log(`

:( The app did not pass the tests. :(
See the log file ${logFile} or the above messages for more information.`)
      await logEntry(logFile, `

:( The app did not pass the tests. :(`, false)
      await logEntry(logFile, logMessage, true)
      return 1
    }

    logMessage = `
:) The app is passing all tests! :)`
    await logEntry(logFile, logMessage, true)
    return 0
  }
}
