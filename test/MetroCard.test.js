const assert = require('assert')
const MetroCard = require('../MetroCard')
const { PASSENGER_TYPES } = require('../config/constants')

describe('MetroCard (unit)', () => {
  it('recharge increases balance and returns 2% fee (ceiled)', () => {
    const c = new MetroCard('T100', 10)
    const fee = c.recharge(40)
    assert.strictEqual(c.getBalance(), 50)
    assert.strictEqual(fee, Math.ceil(40 * 0.02))
  })

  it('deduct reduces balance', () => {
    const c = new MetroCard('T101', 100)
    c.deduct(30)
    assert.strictEqual(c.getBalance(), 70)
  })

  it('tracks single and return trips with passenger-type matching', () => {
    const c = new MetroCard('T102', 100)
    c.setLastTripFrom('CENTRAL', PASSENGER_TYPES.ADULT, false)
    // return to different station and same passenger type -> return trip
    assert.strictEqual(c.isReturnTrip('AIRPORT', PASSENGER_TYPES.ADULT), true)
    // mark as return and ensure no active single
    c.setLastTripFrom('AIRPORT', PASSENGER_TYPES.ADULT, true)
    assert.strictEqual(c.isReturnTrip('CENTRAL', PASSENGER_TYPES.ADULT), false)
  })

  it('does not consider return if passenger type differs', () => {
    const c = new MetroCard('T103', 100)
    c.setLastTripFrom('CENTRAL', PASSENGER_TYPES.ADULT, false)
    assert.strictEqual(c.isReturnTrip('AIRPORT', PASSENGER_TYPES.KID), false)
  })
})
