const Handlebars = require('handlebars')

export const beginningOfFile = Handlebars.compile(`
/*
  This file has been partially generated!
  To permit updates to the generated portions of this code in the future,
  please follow all rules at https://bit.ly/nsFrontEndRules
 */
// ns__file {{fileInfo}}

// ns__custom_start {{fileInfo}}, loc: beforeImports
{{{ defaultContent }}}
// ns__custom_end {{fileInfo}}, loc: beforeImports
`)
