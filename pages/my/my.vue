<template>
	<view>
		<uni-list><uni-list-item :thumb="userInfo.avatarUrl" show-arrow="false" :title="userInfo.nickName" note="TeraWallet by MiaoWoo" /></uni-list>
		<button v-if="!isLogin" type="primary" open-type="getUserInfo" @getuserinfo="onLogin">{{ i18n.wechatLogin }}</button>
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
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { uniList, uniListItem, uniNoticeBar } from '@dcloudio/uni-ui';
import timeKit from '@/kits/time-kit.js';
import context from '@/store/enum.js';
import rpc from '@/rpc/index.js';

const PublicKey = 'PublicKey';

export default {
	components: {
		uniList,
		uniListItem,
		uniNoticeBar
	},
	computed: {
		...mapState(['isLogin', 'userInfo']),
		i18n() {
			return this.$t('my');
		}
	},
	data() {
		return {
			notify: '',
			publicKey: '',
			url: '/static/images/tera.png',
			accounts: []
		};
	},
	async onLoad() {
		this.publicKey = uni.getStorageSync(context.PUBLIC_KEY);
		console.log(this.isLogin);
		uni.startPullDownRefresh();
	},
	async onShow() {
		uni.setNavigationBarTitle({ title: this.$t('my.navigationBarTitle') });
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
		...mapMutations(['login']),
		onLogin: async function(result) {
			if (result.detail.errMsg == 'getUserInfo:ok') {
				this.login(result.detail.userInfo);
				uni.setTabBarItem({
					index: 0,
					text: this.$t('index.tabBarTitle')
				});
				//uni.setTabBarItem({ index: 1, text: this.$t('index.tabBarTitle') });
				uni.setTabBarItem({
					index: 2,
					text: this.$t('my.tabBarTitle')
				});
			}
			console.log(result);
		},
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
