const fs = require('fs-extra')

// parts of a discrepancy
const diffStatement = 'diff -rbBw ([^\\s])* ([^\\s])*\\n'
const locationStatement = '([0-9]|,)*(a|c|d)([0-9]|,)*\\n'
const firstFileLines = '((< .*\\n)*)'
const divider = '(---\\n)?'
const secondFileLines = '((> .*\\n)*)'

const fullRegExBody = `${diffStatement}${locationStatement}${firstFileLines}${divider}${secondFileLines}`
const regEx = new RegExp(fullRegExBody, 'g')

export async function discrepanciesFound(diffFile: string) {
  let problemsFound = false
  let diffString = ''
  try {
    diffString = await fs.readFile(diffFile, 'utf8')
  } catch (error) {
    throw error
  }
  const matches = diffString.match(regEx)
  if (matches && matches.length > 0) {
    problemsFound = true
    // eslint-disable-next-line no-console
    console.log(`
*** DISCREPANCIES FOUND!  You can find discrepancies in ${diffFile}. Please see
https://www.npmjs.com/package/ns-front#working-with-test-results for more information on how to resolve them. ***`)
  }
  // console.log(`matches=${JSON.stringify(matches, null, 2)}`)

  return problemsFound
}

