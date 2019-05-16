<template>
	<view>
		<uni-notice-bar v-if="notify.length != 0" show-icon="true" show-close="true" single="true" :scrollable="notify.length > 25" :text="notify"></uni-notice-bar>
		<uni-list><uni-list-item :thumb="url" :show-arrow="false" title="交易所价格" :note="'更新时间: ' + updateTime" /></uni-list>
		<uni-list>
			<uni-list-item
				:show-arrow="false"
				:show-badge="true"
				:badge-text="transaction.LatestCNYT"
				:title="transaction.Market"
				:note="'原始价格: 1 ' + transaction.From + ' = ' + transaction.Latest + ' ' + transaction.To"
				:key="key"
				v-for="(transaction, key) in transactions"
			/>
		</uni-list>
	</view>
</template>

<script>
import { uniList, uniListItem, uniNoticeBar } from '@dcloudio/uni-ui';
import timeKit from '@/kits/time-kit.js';
import rpc from '@/rpc/index.js';
import context from '@/store/enum.js';

var MAX_VALUE = 1e9;

export default {
	components: {
		uniList,
		uniListItem,
		uniNoticeBar
	},
	data() {
		return {
			notify: '',
			url: '/static/images/tera.png',
			updateTime: new Date().toLocaleString(),
			pairs: [],
			transactions: []
		};
	},
	async onLoad() {
		rpc.request('notify').then(result => (this.notify = result.data));
		uni.clearStorageSync(context.TRANSACTION_TICKER);
		uni.startPullDownRefresh();
	},
	async onPullDownRefresh() {
		try {
			await this.getTransactionPair();
			await this.getTransaction();
		} catch (e) {
			console.error(e);
			uni.showToast({
				title: '数据获取失败!',
				icon: 'none'
			});
		} finally {
			uni.stopPullDownRefresh();
		}
	},
	methods: {
		Multiply: function(arg1, arg2) {
			var m = 0,
				s1 = arg1.toString(),
				s2 = arg2.toString();
			try {
				m += s1.split('.')[1].length;
			} catch (e) {}
			try {
				m += s2.split('.')[1].length;
			} catch (e) {}
			return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
		},
		getTransactionPair: async function() {
			uni.showLoading({
				title: '初始化交易对...',
				mask: true
			});
			var result = uni.getStorageSync(context.TRANSACTION_PAIR);
			if (!result || Number(result.data.time) + 3600000 < new Date().getTime()) {
				result = await rpc.request('transaction', 'GetLatestCNYT');
				console.log(result);
				uni.setStorageSync(context.TRANSACTION_PAIR, result);
			}
			result.data.list.forEach(pair => {
				this.pairs[pair.From] = pair.Latest;
			});
			uni.hideLoading();
		},
		getTransaction: async function() {
			uni.showLoading({
				title: '查询交易所信息...',
				mask: true
			});
			var result = uni.getStorageSync(context.TRANSACTION_TICKER);
			if (!result || Number(result.data.time) + 60000 < new Date().getTime()) {
				result = await rpc.request('transaction', 'GetLatestTeraTickers');
				uni.setStorageSync(context.TRANSACTION_TICKER, result);
			}
			this.updateTime = new Date(Number(result.data.time)).toLocaleString();
			this.transactions = result.data.list;
			this.transactions.forEach(transaction => {
				transaction.LatestCNYT = this.Multiply(transaction.Latest, this.pairs[transaction.To]).toFixed(6);
			});
			uni.hideLoading();
		}
	}
};
</script>

<style></style>
