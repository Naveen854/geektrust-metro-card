const fs = require("fs")
const path = require("path")
const MetroLine = require("./MetroLine")
const { COMMANDS, FARES, STATIONS } = require('./config/constants')

const stations = [STATIONS.CENTRAL, STATIONS.AIRPORT]

const filename = process.argv[2]
if (!filename) {
    console.error('Please provide an input file')
    process.exit(1)
}

let metroLine;

const { parseCommand } = require('./lib/parser')

function parseLine(line) {
    const parsed = parseCommand(line)
    if (!parsed) return

    const { cmd, args } = parsed
    if (cmd === COMMANDS.BALANCE) {
        metroLine.ensureCard(args[0], args[1])
        return
    }

    if (cmd === COMMANDS.CHECK_IN) {
        metroLine.processCheckIn(args[0], args[1], args[2])
        return
    }

    if (cmd === COMMANDS.PRINT_SUMMARY) {
        metroLine.printSummary()
        return
    }
}

fs.readFile(path.resolve(filename), 'utf8', (err, data) => {
    if (err) throw err
    const inputLines = data.toString().split('\n')
    metroLine = new MetroLine(FARES)
    stations.forEach(station => metroLine.addStation(station))
    for (const l of inputLines) parseLine(l)
})

