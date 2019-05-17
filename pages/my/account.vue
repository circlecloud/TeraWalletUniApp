<template>
	<view>
		{{i18n.inDevelopment}}
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		computed: {
			i18n() {
				return this.$t('common')
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
