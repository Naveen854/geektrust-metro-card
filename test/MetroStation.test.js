const assert = require('assert')
const MetroStation = require('../MetroStation')
const { OUTPUT_LABELS, PASSENGER_TYPES } = require('../config/constants')

describe('MetroStation (unit)', () => {
  it('records collections, discounts and passenger counts', () => {
    const s = new MetroStation('CENTRAL')
    s.recordTrip(PASSENGER_TYPES.ADULT, 200, 0, 0)
    s.recordTrip(PASSENGER_TYPES.KID, 50, 0, 0)
    s.recordTrip(PASSENGER_TYPES.ADULT, 200, 0, 0)

    assert.strictEqual(s.totalCollection, 450)
    assert.strictEqual(s.totalDiscount, 0)
    assert.strictEqual(s.passengerCounts[PASSENGER_TYPES.ADULT], 2)
    assert.strictEqual(s.passengerCounts[PASSENGER_TYPES.KID], 1)
  })

  it('formats summary lines correctly and sorts passenger summary', () => {
    const s = new MetroStation('CENTRAL')
    s.recordTrip(PASSENGER_TYPES.KID, 50, 0, 0)
    s.recordTrip(PASSENGER_TYPES.ADULT, 200, 0, 0)
    s.recordTrip(PASSENGER_TYPES.ADULT, 200, 0, 0)

    const lines = s.getSummaryLines()
    assert.strictEqual(lines[0], `${OUTPUT_LABELS.TOTAL_COLLECTION} CENTRAL 450 0`)
    assert.strictEqual(lines[1], OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY)
    // Top passenger should be ADULT with count 2
    assert.strictEqual(lines[2], `${PASSENGER_TYPES.ADULT} 2`)
    assert.strictEqual(lines[3], `${PASSENGER_TYPES.KID} 1`)
  })

  it('recordTrip with default parameters', () => {
    const s = new MetroStation('AIRPORT')
    s.recordTrip(PASSENGER_TYPES.ADULT, 200)
    assert.strictEqual(s.totalCollection, 200)
    assert.strictEqual(s.totalDiscount, 0)
    assert.strictEqual(s.passengerCounts[PASSENGER_TYPES.ADULT], 1)
  })

  it('recordTrip with discount and service fee', () => {
    const s = new MetroStation('CENTRAL')
    s.recordTrip(PASSENGER_TYPES.ADULT, 100, 100, 5)
    assert.strictEqual(s.totalCollection, 105)
    assert.strictEqual(s.totalDiscount, 100)
    assert.strictEqual(s.passengerCounts[PASSENGER_TYPES.ADULT], 1)
  })
})
