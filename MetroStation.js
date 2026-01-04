const { OUTPUT_LABELS } = require('./config/constants')

class MetroStation {
	constructor(name) {
		this.name = name
		this.totalCollection = 0
		this.totalDiscount = 0
		this.passengerCounts = {}
	}

	// Record a trip originating from this station
	// fareCollected: amount of fare charged for the trip
	// discountGiven: amount of discount applied for this trip
	// serviceFee: any recharge fee collected at this station
	recordTrip(passengerType, fareCollected, discountGiven = 0, serviceFee = 0) {
		this.totalCollection += Number(fareCollected) + Number(serviceFee)
		this.totalDiscount += Number(discountGiven)
		this.passengerCounts[passengerType] = (this.passengerCounts[passengerType] || 0) + 1
	}

	// Return formatted lines for this station summary
	getSummaryLines() {
		const lines = []
		lines.push(`${OUTPUT_LABELS.TOTAL_COLLECTION} ${this.name} ${this.totalCollection} ${this.totalDiscount}`)
		lines.push(OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY)

		const entries = Object.entries(this.passengerCounts)
		entries.sort((a, b) => {
			if (b[1] !== a[1]) return b[1] - a[1]
			return a[0].localeCompare(b[0])
		})

		for (const [type, count] of entries) {
			lines.push(`${type} ${count}`)
		}

		return lines
	}
}

module.exports = MetroStation

