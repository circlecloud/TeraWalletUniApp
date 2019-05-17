<template>
	<view class="qiun-columns">
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<view class="qiun-title-dot-light">{{i18n.statistics}}</view>
		</view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<view class="qiun-title-dot-light">{{i18n.supplyNumber}}: {{ Supply.Number }}</view>
		</view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<view class="qiun-title-dot-light">{{i18n.supplyLatest}}: {{ Supply.Latest }} {{i18nCommon.from}} {{ Supply.LatestFrom }}</view>
		</view>
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<view class="qiun-title-dot-light">{{i18n.supplyLatest}}: {{ Supply.Percent }}</view>
		</view>
		<view class="qiun-charts"><canvas canvas-id="canvasGauge" id="canvasGauge" class="charts"></canvas></view>
	</view>
</template>

<script>
	import rpc from '@/rpc/index.js';
	import iconKit from '@/kits/coin-kit.js';
	import service from '@/service/index.js';
	import uCharts from '@/common/u-charts.js';
	var _self;
	var canvaGauge = null;

	const PAGE_NAME = "kanban"

	export default {
		data() {
			return {
				Supply: {
					Number: 0,
					Latest: 0,
					LatestFrom: 0,
					Percent: 0
				},
				cWidth: '',
				cHeight: '',
				gaugeWidth: '', //仪表盘宽度,此设置可使各端宽度一致
				pixelRatio: 1,
				serverData: ''
			};
		},
		computed: {
			i18n() {
				return this.$t(PAGE_NAME);
			},
			i18nCommon() {
				return this.$t('common');
			}
		},
		async onShow() {
			uni.setNavigationBarTitle({
				title: this.$t(PAGE_NAME + '.navigationBarTitle')
			});
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.gaugeWidth = uni.upx2px(30);
			uni.startPullDownRefresh();
		},
		async onPullDownRefresh() {
			uni.showLoading({
				title: this.i18nCommon.loading,
				mask: true
			});
			await this.getServerData();
			uni.hideLoading();
			uni.stopPullDownRefresh();
		},
		onReady() {},
		methods: {
			async getServerData() {
				var result = await service.getSupplyInfo();
				var supply = await service.getLatestSupply();
				this.Supply = {
					Number: result.Supply,
					Latest: iconKit.toNumber(supply.Latest),
					LatestFrom: supply.Num,
					Percent: (result.Percent * 100).toFixed(5)
				};
				let Gauge = {
					categories: [{
							value: 0.2,
							color: '#1890ff'
						},
						{
							value: 0.8,
							color: '#2fc25b'
						},
						{
							value: 1,
							color: '#f04864'
						}
					],
					series: [{
						name: '',
						data: result.Percent,
						color: '#1890ff'
					}]
				};
				_self.showGauge('canvasGauge', Gauge);
			},
			showGauge(canvasId, chartData) {
				canvaGauge = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'gauge',
					fontSize: 11,
					legend: false,
					title: {
						name: Math.round(chartData.series[0].data * 100) + '%',
						color: chartData.categories[1].color,
						fontSize: 25 * _self.pixelRatio,
						offsetY: 50 * _self.pixelRatio //新增参数，自定义调整Y轴文案距离
					},
					subtitle: {
						name: chartData.series[0].name,
						color: '#666666',
						fontSize: 15 * _self.pixelRatio,
						offsetY: -50 * _self.pixelRatio //新增参数，自定义调整Y轴文案距离
					},
					extra: {
						gauge: {
							type: 'default',
							width: _self.gaugeWidth * _self.pixelRatio, //仪表盘背景的宽度
							startAngle: 0.75,
							endAngle: 0.25,
							startNumber: 0,
							endNumber: 100,
							splitLine: {
								fixRadius: 0,
								splitNumber: 10,
								width: _self.gaugeWidth * _self.pixelRatio, //仪表盘背景的宽度
								color: '#FFFFFF',
								childNumber: 5,
								childWidth: _self.gaugeWidth * 0.4 * _self.pixelRatio //仪表盘背景的宽度
							},
							pointer: {
								width: _self.gaugeWidth * 0.8 * _self.pixelRatio, //指针宽度
								color: 'auto'
							}
						}
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true
				});
			}
		}
	};
</script>

<style>
	page {
		background: #f2f2f2;
		width: 750upx;
		overflow-x: hidden;
	}

	.qiun-padding {
		padding: 2%;
		width: 96%;
	}

	.qiun-wrap {
		display: flex;
		flex-wrap: wrap;
	}

	.qiun-rows {
		display: flex;
		flex-direction: row !important;
	}

	.qiun-columns {
		display: flex;
		flex-direction: column !important;
	}

	.qiun-common-mt {
		margin-top: 10upx;
	}

	.qiun-bg-white {
		background: #ffffff;
	}

	.qiun-title-bar {
		width: 96%;
		padding: 10upx 2%;
		flex-wrap: nowrap;
	}

	.qiun-title-dot-light {
		border-left: 10upx solid #0ea391;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000;
	}

	/* 通用样式 */
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #ffffff;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #ffffff;
	}

	/* 横屏样式 */
	.qiun-charts-rotate {
		width: 700upx;
		height: 1100upx;
		background-color: #ffffff;
		padding: 25upx;
	}

	.charts-rotate {
		width: 700upx;
		height: 1100upx;
		background-color: #ffffff;
	}

	/* 圆弧进度样式 */
	.qiun-charts3 {
		width: 750upx;
		height: 250upx;
		background-color: #ffffff;
		position: relative;
	}

	.charts3 {
		position: absolute;
		width: 250upx;
		height: 250upx;
		background-color: #ffffff;
	}

	.qiun-tip {
		display: block;
		width: auto;
		overflow: hidden;
		padding: 15upx;
		height: 30upx;
		line-height: 30upx;
		margin: 10upx;
		background: #ff9933;
		font-size: 30upx;
		border-radius: 8upx;
		justify-content: center;
		text-align: center;
		border: 1px solid #dc7004;
		color: #ffffff;
	}
</style>
