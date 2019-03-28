<template>
	<!-- <div contenteditable="true" class="textarea" v-text="textVal"  @input="filterVal" ref="editBox"></div> -->
	<div contenteditable="true" 
				class="textarea" 
				@input="getVal" 
				@focus="textFocus"
				@blur="textBlur"
				v-html="textVal"
				ref="editBox"></div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	
	export default {
		props:{
			value: {
				type: String,
				default: ''
			},
			place: {
				type: String,
				default: ''
			},
			index: {
				type: Number,
				default: null
			}
		},
		data() {
			return {
				textVal: this.value,
				isShowDefault: false
			}
		}, 
		computed: {
			...mapGetters([
				'wn_isAutoAddText'
				])
		},
		watch: {
			value() {
				// if(this.wn_isAutoAddText) {
				this.textVal = this.value
				this.isShowDefault = false
				this.wn_autoAddText(false)
				// }else {
				// 	this.textVal = this.value //编辑加载需要
				// 	this.isShowDefault = false
				// }
			}
		},
		methods: {
			...mapActions([
				'wn_addContent',
				'wn_autoAddText'
				]),
			defaultText() {
				return `<span class="defaultText" style="font-size: 16px;color: #9FA6AD;font-weight: 500">${this.place}</span>`
			},
			textFocus() {
				if(this.isShowDefault) {
					this.textVal = ''
				}
			},
			textBlur() {
				if(this.isShowDefault) {
					this.textVal = this.defaultText()
				}

				if(this.index !== null) {
					this.wn_addContent(this.index)
				}
			},
			getVal(){
                let value = this.$api.trim(this.$refs.editBox.innerHTML);

                if(value == '') {
                	this.isShowDefault = true
                }else {
                	this.isShowDefault = false
                }

                this.$emit('input',value)
            }
		},
		mounted() {
			 if(this.textVal == '') {
			 	this.textVal = this.defaultText()
			 	this.isShowDefault = true
			 }
		}
	}
</script>

<style scoped>
	.textarea {
		width: 100%;
		height: auto;
		outline: none;
		min-height: 40px;
		border: none;
		font-size: 16px;
		color: #373A3E;
		font-weight: 500;
		text-align: left;
	}
</style>