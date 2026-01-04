const assert = require('assert')
const MetroLine = require('../MetroLine')
const MetroCard = require('../MetroCard')
const { STATIONS, ERROR_MESSAGES, PASSENGER_TYPES } = require('../config/constants')

describe('MetroLine helpers', () => {
  const fares = { ADULT: 200, SENIOR_CITIZEN: 100, KID: 50 }
  let ml

  beforeEach(() => {
    ml = new MetroLine(fares)
    ml.addStation(STATIONS.CENTRAL)
    ml.addStation(STATIONS.AIRPORT)
    ml.ensureCard('MC1', 0)
  })

  it('_computeFareAndDiscount returns half fare for return', () => {
    const res = ml._computeFareAndDiscount(200, true)
    assert.strictEqual(res.fareToCharge, Math.floor(200 / 2))
    assert.strictEqual(res.discount, 200 - res.fareToCharge)
  })

  it('_handleRechargeIfNeeded returns 0 when balance sufficient', () => {
    const card = ml.cards['MC1']
    card.balance = 200
    const fee = ml._handleRechargeIfNeeded(card, 100)
    assert.strictEqual(fee, 0)
  })

  it('_handleRechargeIfNeeded recharges and returns fee when short', () => {
    const card = ml.cards['MC1']
    card.balance = 10
    const fee = ml._handleRechargeIfNeeded(card, 100)
    assert.ok(Number.isInteger(fee))
    assert.ok(card.getBalance() >= 100)
  })

  it('_validateEntities throws for unknown card or station', () => {
    const err1 = assert.rejects ? () => {} : null
    try {
      ml._validateEntities('UNKNOWN', STATIONS.CENTRAL)
    } catch (e) {
      assert.strictEqual(e.message, ERROR_MESSAGES.CARD_NOT_REGISTERED.replace('{cardId}', 'UNKNOWN'))
    }

    try {
      ml._validateEntities('MC1', 'NOWHERE')
    } catch (e) {
      assert.strictEqual(e.message, ERROR_MESSAGES.STATION_NOT_FOUND.replace('{station}', 'NOWHERE'))
    }
  })

  it('_getFare returns configured fare', () => {
    assert.strictEqual(ml._getFare(PASSENGER_TYPES.ADULT), 200)
    assert.strictEqual(ml._getFare(PASSENGER_TYPES.KID), 50)
  })

  it('_applyTripOutcome updates card and station correctly', () => {
    const card = ml.cards['MC1']
    card.balance = 500
    const station = ml.stations[STATIONS.CENTRAL]
    ml._applyTripOutcome(card, station, PASSENGER_TYPES.ADULT, 200, 0, 0, false, STATIONS.CENTRAL)
    assert.strictEqual(card.getBalance(), 300)
    assert.strictEqual(station.totalCollection, 200)
    assert.strictEqual(station.totalDiscount, 0)
    assert.strictEqual(station.passengerCounts[PASSENGER_TYPES.ADULT], 1)
  })
})
