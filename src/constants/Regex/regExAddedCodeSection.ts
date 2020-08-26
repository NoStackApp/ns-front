const commentOpen = '(\\/\\/|{\\/\\*)'
const locationSpec = '(\\w*), comp: (\\w*), loc: (\\w*)'
const endOfFirstLine = '( \\*\\/\\}\\n|\\n)'
const locationRepetition = '\\2, comp: \\3, loc: \\4'
const content = '((.|\n)*?)'
const firstLineBody = `${commentOpen} ns__custom_start unit: ${locationSpec}${endOfFirstLine}`
const fullRegExBody = `${firstLineBody}${content}${commentOpen} ns__custom_end unit: ${locationRepetition}`

export const regExAddedCodeSection = new RegExp(fullRegExBody, 'g')
export const regExForFirstLine = new RegExp(firstLineBody, 'g')
