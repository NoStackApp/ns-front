const fs = require('fs-extra')
const Handlebars = require('handlebars')

export async function loadFileTemplate(path: string) {
  let template = ''
  try {
    template = await fs.readFile(path, 'utf-8') // require('../sections/generic.hbs')
  } catch (error) {
    console.error(error)
    throw new Error(`error finding the file ${path}.
It may be that the template location is faulty, or that the template is not
correctly specified:
${error}`)
  }

  return Handlebars.compile(template)
}
