import rpc from '@/rpc/index.js'
import iconKit from '@/kits/coin-kit.js'

const MAX_CENT = 1e9

async function getSupplyInfo() {
	var systemAccount = await rpc.GetAccountInfo(0);
	var MaxSupply = 1000000000;
	var AvailableSupply = iconKit.toNumber(systemAccount.Value);
	var Supply = 1000000000 - AvailableSupply;
	return {
		MaxSupply,
		AvailableSupply,
		Supply,
		Percent: Supply / MaxSupply
	}
}

async function getLatestSupply() {
	return await rpc.GetLatestSupply();
}

module.exports = {
	getSupplyInfo,
	getLatestSupply
};
