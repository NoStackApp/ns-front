import {Command, flags} from '@oclif/command'

import {createPlaceholderApp} from '../apps/createPlaceholderApp'
import {getBaseApp} from '../inputs/getBaseApp'
import {isRequired} from '../inputs/isRequired'

// import {createNoStackApp} from '../apps/createNoStackApp'

function isRequiredForNewApp(paramName: string, flag: string) {
  return isRequired(paramName, 'newapp', flag)
}

export default class Newapp extends Command {
  static description = 'new placeholder app.  Creates an "empty" app (like create-react-app) for a template that you can build on with makecode.'

  static flags = {
    help: flags.help({char: 'h'}),
    templateDir: flags.string({char: 't', description: 'template directory'}),
    appDir: flags.string({char: 'a', description: 'application directory'}),
    baseApp: flags.string({char: 'b', description: 'directory of the base app to copy. If it does not exist, it is created.'}),
  }

  static examples = [
    '$ nostack newapp -t ~/templates/basicTemplate -a ~/temp/myapp -b ~/temp/baseapp',
  ]
  // static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(Newapp)
    const appDir = flags.appDir || ''
    if (appDir.length === 0) isRequiredForNewApp('appDir', '-a')
    const templateDir = flags.templateDir || ''
    if (templateDir.length === 0) isRequiredForNewApp('templateDir', '-t')
    let baseApp = flags.baseApp || ''
    if (baseApp.length > 0) baseApp = await getBaseApp(baseApp)

    const newAppTasks = await createPlaceholderApp(appDir, baseApp, templateDir)
    await newAppTasks.run().catch((error: any) => {
      this.error(error)
    })
    // shell.exec(`/home/yisrael/projects/ns-cli/bin/create-no-stack-app "${appDir}"`)
  }
}
