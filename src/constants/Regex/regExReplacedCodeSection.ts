import {commentOpen, content, endOfLine} from './regExShared'

const firstLineBody = `${commentOpen} ns__start_replacement (\\w*)${endOfLine}`
const fullRegExBody = `${firstLineBody}${content}${commentOpen} ns__end_replacement \\2${endOfLine}`

export const regExReplacedCodeSection = new RegExp(fullRegExBody, 'g')
