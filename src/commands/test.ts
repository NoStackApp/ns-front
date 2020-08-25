import {Command, flags} from '@oclif/command'
import {isRequired} from '../isRequired'

export default class Test extends Command {
  static description = String(
    'test lets you confirm that your code is not violating any' +
    'of the rules for testing required by nostack.  For documentation about those ' +
    'rules, please see https://bit.ly/nsFrontEndRules.' +
    'This is actually one of the tests conducted by NoStack to gauge the quality of ' +
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

    this.log(`run ${this.config.bin} ${appDir} from ./src/commands/test.ts`)
  }
}
