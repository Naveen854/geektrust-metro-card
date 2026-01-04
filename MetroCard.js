const SERVICE_FEE_RATE = require('./config/constants').SERVICE_FEE_RATE

/**
 * Represents a metro card with balance and trip tracking.
 */
class MetroCard {
    constructor(id, balance = 0) {
        this.id = id
        this.balance = Number(balance) || 0
        this.lastTripFrom = null
        this.lastPassengerType = null
        this.hasActiveSingle = false
    }

    getBalance() {
        return this.balance
    }

    // Recharge only the required amount; returns the service fee collected (2% rounded up)
    recharge(amount) {
        amount = Math.ceil(Number(amount) || 0)
        if (amount <= 0) return 0
        this.balance += amount
        const fee = Math.ceil(amount * SERVICE_FEE_RATE)
        return fee
    }

    // Deduct fare from the card (assumes sufficient balance)
    deduct(amount) {
        this.balance -= amount
    }

    // Update trip state:
    // - when starting a single: supply station and passengerType (wasReturn = false)
    // - when handling a return: set wasReturn = true to clear pending state
    setLastTripFrom(station, passengerType = null, wasReturn = false) {
        if (wasReturn) {
            this.lastTripFrom = null
            this.lastPassengerType = null
            this.hasActiveSingle = false
        } else {
            this.lastTripFrom = station
            this.lastPassengerType = passengerType
            this.hasActiveSingle = true
        }
    }

    // Return trip only when there is an active single from a different station
    // AND the passenger type matches the original trip's passenger type.
    isReturnTrip(fromStation, currentPassengerType) {
        return (
            this.hasActiveSingle &&
            this.lastTripFrom &&
            this.lastTripFrom !== fromStation &&
            this.lastPassengerType === currentPassengerType
        )
    }
}

module.exports = MetroCard