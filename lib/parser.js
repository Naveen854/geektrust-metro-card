const { COMMANDS } = require('../config/constants')

// Normalize a line into { cmd, args }
function parseCommand(line) {
  if (!line) return null
  line = line.trim()
  if (!line) return null

  const tokens = line.split(/\s+/)
  const first = tokens[0]

  if (first === COMMANDS.BALANCE || first.startsWith(COMMANDS.BALANCE)) {
    if (first === COMMANDS.BALANCE) return { cmd: COMMANDS.BALANCE, args: tokens.slice(1) }
    return { cmd: COMMANDS.BALANCE, args: [first.substring(COMMANDS.BALANCE.length), tokens[1]] }
  }

  if (first === COMMANDS.CHECK_IN || first.startsWith(COMMANDS.CHECK_IN)) {
    if (first === COMMANDS.CHECK_IN) return { cmd: COMMANDS.CHECK_IN, args: tokens.slice(1) }
    return { cmd: COMMANDS.CHECK_IN, args: [first.substring(COMMANDS.CHECK_IN.length), tokens[1], tokens[2]] }
  }

  if (line === COMMANDS.PRINT_SUMMARY) return { cmd: COMMANDS.PRINT_SUMMARY, args: [] }

  return null
}

module.exports = { parseCommand }
