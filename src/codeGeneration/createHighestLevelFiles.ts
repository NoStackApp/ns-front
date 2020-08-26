import {boilerplateDir} from '../constants'
import {StackInfo} from '../constants/types'

import {compDir, srcDir} from './createTopProjectDirs'
// import {appNameFromPath} from inflections'./generateAppCode'
import {generateAppFile} from './generateAppFile'

const fs = require('fs-extra')
const Handlebars = require('handlebars')

export async function createHighestLevelFiles(
  currentStack: StackInfo,
  appDir: string,
  userClass: string,
  appName: string,
) {
  // DeleteInstanceMenu
  await fs.copy(
    `${boilerplateDir}/DeleteInstanceMenu.js`,
    `${compDir}/DeleteInstanceMenu/index.js`,
  )

  // EditInstanceForm
  await fs.copy(
    `${boilerplateDir}/EditInstanceForm.js`,
    `${compDir}/EditInstanceForm/index.js`,
  )

  // LoginForm
  await fs.copy(
    `${boilerplateDir}/LoginForm.js`,
    `${compDir}/LoginForm/index.js`,
  )

  // Forgot Password Button
  await fs.copy(
    `${boilerplateDir}/ForgotPasswordButton.js`,
    `${compDir}/ForgotPasswordButton/index.js`,
  )
  await fs.copy(
    `${boilerplateDir}/ResetPasswordForm.js`,
    `${compDir}/ForgotPasswordButton/ResetPasswordForm.js`,
  )
  await fs.copy(
    `${boilerplateDir}/SendCodeForm.js`,
    `${compDir}/ForgotPasswordButton/SendCodeForm.js`,
  )

  // RegistrationForm
  await fs.copy(
    `${boilerplateDir}/RegistrationForm.js`,
    `${compDir}/RegistrationForm/index.js`,
  )

  // RegistrationForm.style
  await fs.copy(
    `${boilerplateDir}/RegistrationForm.style.js`,
    `${compDir}/RegistrationForm/RegistrationForm.style.js`,
  )

  // RegistrationField
  await fs.copy(
    `${boilerplateDir}/RegistrationField.js`,
    `${compDir}/RegistrationForm/RegistrationField.js`,
  )

  // AuthTabs
  await fs.copy(
    `${boilerplateDir}/AuthTabs.js`,
    `${compDir}/AuthTabs/index.js`,
  )

  // client file
  await fs.copy(`${boilerplateDir}/client.js`, `${srcDir}/client/index.js`)

  // flattenData file
  await fs.copy(
    `${boilerplateDir}/flattenData.js`,
    `${srcDir}/flattenData/index.js`,
  )

  // index.js
  await fs.copy(`${boilerplateDir}/index.js`, `${srcDir}/index.js`)

  // NavBar
  const navBar = Handlebars.compile(
    await fs.readFile(`${boilerplateDir}/NavBar.js`, 'utf-8'),
  )
  await fs.outputFile(
    `${compDir}/NavBar/index.js`,
    navBar({appName}),
  )

  // App file
  await generateAppFile(currentStack, userClass)
}
