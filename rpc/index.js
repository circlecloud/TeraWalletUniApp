function printRequest(module, action, data, response, cost) {
	var groupName = 'RPC CALL DEBUG'
	console.group(groupName);
	console.log('Request Module :', module);
	console.log('Request Action :', action);
	console.log('Request Data   :', data);
	console.log('Response       :', response);
	console.log('Cost Time      :', cost);
	console.groupEnd(groupName);
}

async function request(module, action, data) {
	var startTime = new Date().getTime();
	var response;
	try {
		var response = await wx.cloud.callFunction({
			name: module,
			data: {
				action,
				data
			}
		})
		response = response.result;
	} catch (e) {
		response = e;
	} finally {
		printRequest(module, action, data, response, new Date().getTime() - startTime)
		return response;
	}
}

async function GetAccountListByKey(Key) {
	return await request('api', 'GetAccountListByKey', {
		Key
	})
}

async function GetBalance(AccountID) {
	return await request('api', 'GetBalance', {
		AccountID
	})
}

async function GetAccountInfo(AccountID) {
	return await request('api', 'GetAccountInfo', {
		StartNum: AccountID
	})
}

async function GetCurrentInfo() {
	return await request('api', 'GetCurrentInfo')
}

async function GetBlockInfo(block) {
	return await request('api', 'GetBlockInfo', block)
}

async function GetLatestSupply(block) {
	return await request('api', 'GetLatestSupply')
}

module.exports = {
	request,
	GetAccountListByKey,
	GetBalance,
	GetAccountInfo,
	GetCurrentInfo,
	GetBlockInfo,
	GetLatestSupply
};
