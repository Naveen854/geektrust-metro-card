const MetroCard = require('./MetroCard')
const MetroStation = require('./MetroStation')
const { RETURN_FARE_DIVISOR, ERROR_MESSAGES } = require('./config/constants')

class MetroLine {
    constructor(fares){
        this.fares = fares
        this.stations = {}
        this.cards = {}
    }

    addStation(stationName){
        this.stations[stationName] = new MetroStation(stationName)
    }

    ensureCard(cardId, initialBalance){
        if (!this.cards[cardId]) {
            this.cards[cardId] = new MetroCard(cardId, initialBalance)
        }
    }
    processCheckIn(cardId, passengerType, fromStation){
        const { card, station } = this._validateEntities(cardId, fromStation)

        const fullFare = this._getFare(passengerType)
        const isReturn = card.isReturnTrip(fromStation, passengerType)

        const { fareToCharge, discount } = this._computeFareAndDiscount(fullFare, isReturn)
        const serviceFee = this._handleRechargeIfNeeded(card, fareToCharge)

        this._applyTripOutcome(card, station, passengerType, fareToCharge, discount, serviceFee, isReturn, fromStation)
    }

    // Helper: validate card and station existence
    _validateEntities(cardId, fromStation){
        const card = this.cards[cardId]
        const station = this.stations[fromStation]
        if (!card) throw new Error(ERROR_MESSAGES.CARD_NOT_REGISTERED.replace('{cardId}', cardId))
        if (!station) throw new Error(ERROR_MESSAGES.STATION_NOT_FOUND.replace('{station}', fromStation))
        return { card, station }
    }

    // Helper: get fare for passenger type
    _getFare(passengerType){
        return this.fares[passengerType]
    }

    // Helper: compute fare and discount based on return flag
    _computeFareAndDiscount(fullFare, isReturn){
        if (isReturn){
            const fareToCharge = Math.floor(fullFare / RETURN_FARE_DIVISOR)
            return { fareToCharge, discount: fullFare - fareToCharge }
        }
        return { fareToCharge: fullFare, discount: 0 }
    }

    // Helper: ensure card has enough balance, perform recharge if needed, return serviceFee
    _handleRechargeIfNeeded(card, fareToCharge){
        const shortfall = Math.max(0, fareToCharge - card.getBalance())
        if (shortfall > 0) return card.recharge(shortfall)
        return 0
    }

    // Helper: apply deductions, update card state and record trip at station
    _applyTripOutcome(card, station, passengerType, fareToCharge, discount, serviceFee, isReturn, fromStation){
        card.deduct(fareToCharge)
        card.setLastTripFrom(fromStation, passengerType, isReturn)
        station.recordTrip(passengerType, fareToCharge, discount, serviceFee)
    }

    printSummary(){
        for (const stationName in this.stations) {
            const station = this.stations[stationName]
            const lines = station.getSummaryLines()
            for (const line of lines) {
                console.log(line)
            }
            console.log('')
        }
    }
}

module.exports = MetroLine