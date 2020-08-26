const locationSpec = '(\\w*), comp: (\\w*), loc: (\\w*)'
const locationRepetition = '\\2, comp: \\3, loc: \\4'

const commentOpen = '(\\/\\/|{\\/\\*)'
const endOfFirstLine = '( \\*\\/\\}\\n|\\n)'
const content = '((.|\n)*?)'

const firstLineBody = `${commentOpen} ns__start_section unit: ${locationSpec}${endOfFirstLine}`
const fullRegExBody = `${firstLineBody}${content}${commentOpen} ns__end_section unit: ${locationRepetition}`

export const regExGeneratedCodeSection = new RegExp(fullRegExBody, 'g')
