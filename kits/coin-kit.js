const MAX_CENT = 1e9

function toNumber(Value) {
	return (Value.SumCOIN * MAX_CENT + Value.SumCENT) / MAX_CENT;
}
module.exports = {
	MAX_CENT,
	toNumber
}
