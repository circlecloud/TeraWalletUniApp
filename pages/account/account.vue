<template>
	<view>
		<view class="uni-form-item uni-column">
			<view class="title">{{ i18n.title }}</view>
			<input class="uni-input" v-model="publicKey" :placeholder="i18n.placeholder" />
		</view>
		<uni-list>
			<uni-list-item
				show-arrow:
				false
				:show-badge="account.Latest.Amount > 0"
				:badge-type="getBadgeTypeByTime(account.Latest)"
				:badge-text="getBadgeTextByTime(account.Latest)"
				:title="account.Num"
				:note="formatNote(account)"
				:key="key"
				v-for="(account, key) in accounts"
			/>
		</uni-list>
	</view>
</template>

<script>
import { uniList, uniListItem, uniNoticeBar } from '@dcloudio/uni-ui';
import timeKit from '@/kits/time-kit.js';
import context from '@/store/enum.js';
import rpc from '@/rpc/index.js';

const PAGE_NAME = 'account';

export default {
	components: {
		uniList,
		uniListItem,
		uniNoticeBar
	},
	computed: {
		i18n() {
			return this.$t(PAGE_NAME);
		}
	},
	async onShow() {
		uni.setNavigationBarTitle({
			title: this.$t(PAGE_NAME + '.navigationBarTitle')
		});
	},
	data() {
		return {
			publicKey: '',
			accounts: []
		};
	},
	async onLoad() {
		this.publicKey = uni.getStorageSync(context.PUBLIC_KEY);
		if (!this.publicKey) {
			uni.startPullDownRefresh();
		}
	},
	async onPullDownRefresh() {
		if (!this.publicKey) {
			this.stopLoading();
			return;
		}
		uni.showLoading({
			title: '数据加载中...',
			mask: true
		});
		await this.checkPublicKey();
		uni.setStorageSync(context.PUBLIC_KEY, this.publicKey);
		await this.getAccountsList();
		this.stopLoading();
	},
	methods: {
		getAccountsList: async function() {
			var accounts = await rpc.GetAccountListByKey(this.publicKey);
			if (!accounts.length) {
				uni.showModal({
					title: '错误',
					content: '无效的账户公钥或该公钥下无账户!'
				});
				this.stopLoading();
				return;
			}
			this.accounts = accounts;
		},
		checkPublicKey: async function() {
			if (!isNaN(Number(this.publicKey))) {
				var balance = await rpc.GetBalance(this.publicKey);
				if (!balance.result) {
					uni.showModal({
						title: '错误',
						content: '无效的账户ID'
					});
					this.stopLoading();
					return;
				}
				this.publicKey = balance.PubKey;
			}
		},
		stopLoading: function() {
			uni.hideLoading();
			uni.stopPullDownRefresh();
		},
		getBadgeTypeByTime: function(Latest) {
			if (Latest.Time > 18000) {
				return 'error';
			} else if (Latest.Time > 10800) {
				return 'warning';
			} else if (Latest.Amount > 0) {
				return 'success';
			} else {
				return 'default';
			}
		},
		getBadgeTextByTime: function(Latest) {
			return this.formatSecond(Latest.Time) + '前';
		},
		formatNote: function(account) {
			return '名称: ' + account.Name + '\n余额: ' + account.Amount;
		},
		formatSecond: function(time) {
			return timeKit.formatShortTime(time, 2);
		}
	}
};
</script>

<style></style>
