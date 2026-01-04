const assert = require('assert')
const { execSync } = require('child_process')
const { it } = require('mocha')
const { OUTPUT_LABELS, STATIONS, PASSENGER_TYPES } = require('../config/constants')

function joinLines(lines){
	return lines.join('\n').trim()
}

function runAndAssert(inputFile, expectedLines){
	const out = execSync(`node geektrust.js ${inputFile}`).toString().trim()
	assert.strictEqual(out, joinLines(expectedLines))
}

function mergeBlocks(centralBlock, airportBlock){
	return [...centralBlock, '', ...airportBlock]
}


describe('Integration', () => {
	it('matches sample input 1 output', () => {
		runAndAssert('sample_input/input1.txt', 
			mergeBlocks([
				`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 300 0`,
				OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
				`${PASSENGER_TYPES.ADULT} 1`,
				`${PASSENGER_TYPES.SENIOR_CITIZEN} 1`
			],[
				`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 403 100`,
				OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
				`${PASSENGER_TYPES.ADULT} 2`,
				`${PASSENGER_TYPES.KID} 2`
			]))
	})

	it('matches sample input 2 output', () => {
		runAndAssert('sample_input/input2.txt', mergeBlocks([
			`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 457 50`,
			OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
			`${PASSENGER_TYPES.ADULT} 2`,
			`${PASSENGER_TYPES.SENIOR_CITIZEN} 1`
		],[
			`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 252 100`,
			OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
			`${PASSENGER_TYPES.ADULT} 1`,
			`${PASSENGER_TYPES.KID} 1`,
			`${PASSENGER_TYPES.SENIOR_CITIZEN} 1`
		]))
	})
})

describe("Recharge", () => {
	it("should not charge service fee when balance is exactly fare amount", () => {
		runAndAssert('sample_input/exact_balance.txt', mergeBlocks([
			`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 200 0`,
			OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
			`${PASSENGER_TYPES.ADULT} 1`
		],[
			`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 0 0`,
			OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY
		]))
	})

	it("should handle multiple recharges and trips correctly", () => {
			runAndAssert('sample_input/multiple_recharges.txt', mergeBlocks([
				`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 406 0`,
				OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
				`${PASSENGER_TYPES.ADULT} 2`
			],[
				`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 102 100`,
				OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
				`${PASSENGER_TYPES.ADULT} 1`
			]))
	})

	it("should handle return journey discount", () => {
			runAndAssert('sample_input/return_journey_discount.txt', mergeBlocks([
				`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 200 0`,
				OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
				`${PASSENGER_TYPES.ADULT} 1`
			],[
				`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 100 100`,
				OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
				`${PASSENGER_TYPES.ADULT} 1`
			]))
	})
	it('should handle zero balance card with recharges and trips', () => {
		runAndAssert('sample_input/zero_balance_card.txt', mergeBlocks([
			`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 0 0`,
			OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY
		],[
			`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 51 0`,
			OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
			`${PASSENGER_TYPES.KID} 1`
		]))
	})
})

describe("Checkins", () => {
	it("should handle no checkins gracefully", () => {
		runAndAssert('sample_input/no_checkins.txt', mergeBlocks([
			`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 0 0`,
			OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY
		],[
			`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 0 0`,
			OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY
		]))
	});

	it("should handle large checkins gracefully", () => {
				runAndAssert('sample_input/large_checkins.txt', mergeBlocks([
						`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 450 0`,
						OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
						`${PASSENGER_TYPES.ADULT} 2`,
						`${PASSENGER_TYPES.KID} 1`
					],[
						`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 200 100`,
						OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
						`${PASSENGER_TYPES.ADULT} 1`,
						`${PASSENGER_TYPES.SENIOR_CITIZEN} 1`
					]))
	});
});

describe("Edge Cases", () => {

	it("should consider as new journey when same card is used in same station consecutively", () => {
				runAndAssert('sample_input/same_station_consecutive.txt', mergeBlocks([
						`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 402 0`,
						OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
						`${PASSENGER_TYPES.ADULT} 2`
					],[
						`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 0 0`,
						OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY
					]))
	});

	it("should consider as new journey when same card is with different passenger type", () => {
				runAndAssert('sample_input/same_card_diff_passenger_type.txt', mergeBlocks([
					`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.CENTRAL} 200 0`,
					OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
					`${PASSENGER_TYPES.ADULT} 1`
				],[
					`${OUTPUT_LABELS.TOTAL_COLLECTION} ${STATIONS.AIRPORT} 50 0`,
					OUTPUT_LABELS.PASSENGER_TYPE_SUMMARY,
					`${PASSENGER_TYPES.KID} 1`
				]))
	})
});
