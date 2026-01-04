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

  it('constructor with default balance', () => {
    const c = new MetroCard('T104')
    assert.strictEqual(c.getBalance(), 0)
    assert.strictEqual(c.id, 'T104')
  })

  it('recharge with zero amount returns 0 fee', () => {
    const c = new MetroCard('T105', 100)
    const fee = c.recharge(0)
    assert.strictEqual(fee, 0)
    assert.strictEqual(c.getBalance(), 100)
  })

  it('recharge with negative amount returns 0 fee', () => {
    const c = new MetroCard('T106', 100)
    const fee = c.recharge(-10)
    assert.strictEqual(fee, 0)
    assert.strictEqual(c.getBalance(), 100)
  })

  it('recharge with invalid values handles gracefully', () => {
    const c = new MetroCard('T107', 100)
    const fee1 = c.recharge(null)
    assert.strictEqual(fee1, 0)
    const fee2 = c.recharge(undefined)
    assert.strictEqual(fee2, 0)
    const fee3 = c.recharge(NaN)
    assert.strictEqual(fee3, 0)
  })

  it('isReturnTrip returns false when no active single trip', () => {
    const c = new MetroCard('T108', 100)
    assert.strictEqual(c.isReturnTrip('AIRPORT', PASSENGER_TYPES.ADULT), false)
  })

  it('isReturnTrip returns false when lastTripFrom is null', () => {
    const c = new MetroCard('T109', 100)
    c.hasActiveSingle = true
    c.lastTripFrom = null
    // When lastTripFrom is null, the && expression returns null (falsy)
    assert.ok(!c.isReturnTrip('AIRPORT', PASSENGER_TYPES.ADULT))
  })

  it('isReturnTrip returns false when from same station', () => {
    const c = new MetroCard('T110', 100)
    c.setLastTripFrom('CENTRAL', PASSENGER_TYPES.ADULT, false)
    assert.strictEqual(c.isReturnTrip('CENTRAL', PASSENGER_TYPES.ADULT), false)
  })

  it('setLastTripFrom with wasReturn clears trip state', () => {
    const c = new MetroCard('T111', 100)
    c.setLastTripFrom('CENTRAL', PASSENGER_TYPES.ADULT, false)
    assert.strictEqual(c.hasActiveSingle, true)
    c.setLastTripFrom('AIRPORT', PASSENGER_TYPES.ADULT, true)
    assert.strictEqual(c.hasActiveSingle, false)
    assert.strictEqual(c.lastTripFrom, null)
    assert.strictEqual(c.lastPassengerType, null)
  })
})
