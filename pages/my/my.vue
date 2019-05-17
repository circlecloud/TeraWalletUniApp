<template>
	<view class="page">
		<view class="uni-header-logo">
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-media-list">
						<view class="uni-media-list-logo"><image :src="userInfo.avatarUrl"></image></view>
						<view class="uni-media-list-body">
							<view class="uni-media-list-text-top">{{ userInfo.nickName }}</view>
							<view class="uni-media-list-text-bottom uni-ellipsis">TeraWallet by MiaoWoo</view>
						</view>
						<button v-if="!isLogin" type="primary" class="login-btn" open-type="getUserInfo" @getuserinfo="onLogin">{{ i18n.wechatLogin }}</button>
						<button v-if="isLogin" type="warn" class="login-btn" @click="onLogout">{{ i18n.wechatLogout }}</button>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card" v-for="(list, index) in lists" :key="index">
			<view class="uni-list">
				<view class="uni-list-cell uni-collapse">
					<view
						class="uni-list-cell-navigate"
						hover-class="uni-list-cell-hover"
						:class="[list.open ? 'uni-active' : '', list.pages ? 'uni-navigate-bottom' : 'uni-navigate-right']"
						@click="triggerCollapse(index)"
					>
						{{ list.name }}
					</view>
					<view class="uni-list uni-collapse" v-if="list.pages" :class="list.open ? 'uni-active' : ''">
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item, key) in list.pages" :key="key" @click="goDetailPage(item)">
							<view class="uni-list-cell-navigate uni-navigate-right">{{ item.name ? item.name : item }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { uniList, uniListItem, uniNoticeBar } from '@dcloudio/uni-ui';
import timeKit from '@/kits/time-kit.js';
import context from '@/store/enum.js';
import rpc from '@/rpc/index.js';

const PAGE_NAME = 'my';

export default {
	components: {
		uniList,
		uniListItem,
		uniNoticeBar
	},
	computed: {
		...mapState(['isLogin', 'userInfo']),
		i18n() {
			return this.$t(PAGE_NAME);
		}
	},
	async onShow() {
		this.changeTitle();
	},
	data() {
		return {
			lists: []
		};
	},
	onLoad() {},
	methods: {
		...mapActions(['login', 'logout']),
		changeTitle() {
			uni.setNavigationBarTitle({
				title: this.$t(PAGE_NAME + '.navigationBarTitle')
			});
		},
		onLogin: async function(result) {
			if (result.detail.errMsg == 'getUserInfo:ok') {
				this.login({
					vueInstance: this,
					userInfo: result.detail.userInfo
				});
			}
			this.changeTitle();
		},
		onLogout: function() {
			this.logout({ vueInstance: this });
			this.changeTitle();
		},
		triggerCollapse(e) {
			if (!this.lists[e].pages) {
				this.goDetailPage(this.lists[e].url);
				return;
			}
			for (var i = 0; i < this.lists.length; ++i) {
				if (e === i) {
					this.lists[i].open = !this.lists[e].open;
				} else {
					this.lists[i].open = false;
				}
			}
		},
		goDetailPage(e) {
			let path = e.url ? e.url : e;
			uni.navigateTo({
				url: '/pages' + path
			});
			return false;
		}
	}
};
</script>

<style>
.login-btn {
	position: none;
	padding: 0 1.34em;
	background-color: transparent;
	font-size: 13px;
	line-height: 3.5;
}
</style>
