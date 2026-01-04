const assert = require('node:assert')
const { parseCommand } = require('../lib/parser')
const { COMMANDS } = require('../config/constants')

describe('Parser (unit)', () => {
  it('parses BALANCE command with space', () => {
    const result = parseCommand('BALANCE MC1 100')
    assert.strictEqual(result.cmd, COMMANDS.BALANCE)
    assert.deepStrictEqual(result.args, ['MC1', '100'])
  })

  it('parses BALANCE command without space (concatenated)', () => {
    const result = parseCommand('BALANCEMC1 100')
    assert.strictEqual(result.cmd, COMMANDS.BALANCE)
    assert.deepStrictEqual(result.args, ['MC1', '100'])
  })

  it('parses CHECK_IN command with space', () => {
    const result = parseCommand('CHECK_IN MC1 ADULT CENTRAL')
    assert.strictEqual(result.cmd, COMMANDS.CHECK_IN)
    assert.deepStrictEqual(result.args, ['MC1', 'ADULT', 'CENTRAL'])
  })

  it('parses CHECK_IN command without space (concatenated)', () => {
    const result = parseCommand('CHECK_INMC1 ADULT CENTRAL')
    assert.strictEqual(result.cmd, COMMANDS.CHECK_IN)
    assert.deepStrictEqual(result.args, ['MC1', 'ADULT', 'CENTRAL'])
  })

  it('parses PRINT_SUMMARY command', () => {
    const result = parseCommand('PRINT_SUMMARY')
    assert.strictEqual(result.cmd, COMMANDS.PRINT_SUMMARY)
    assert.deepStrictEqual(result.args, [])
  })

  it('returns null for empty string', () => {
    assert.strictEqual(parseCommand(''), null)
  })

  it('returns null for whitespace only', () => {
    assert.strictEqual(parseCommand('   '), null)
  })

  it('returns null for invalid command', () => {
    assert.strictEqual(parseCommand('INVALID_COMMAND'), null)
  })

  it('returns null for null input', () => {
    assert.strictEqual(parseCommand(null), null)
  })
})

