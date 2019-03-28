<template>
	<div class="clubRcm">
		<div class="clubRcmInput">
			<el-autocomplete
		      class="inline-input"
		      v-model="state"
		      value-key="name"
		      :fetch-suggestions="querySearch"
		      placeholder="请输入自驾团"
		      @select="handleSelect"
		    ></el-autocomplete>
		    <p><span @click.stop="showDeleteBox">查看全部</span></p>
		</div>
	</div>
</template>

<script>
	import { mapGetters , mapActions } from 'vuex';
	import config from '@/config'
	
	export default {
		data() {
			return {
				state: '',
				isRcmProvince: false,
				searchTime: 0,
				searchTimer: ''
			}
		},
		props: {
			index: Number,
			clubObj: {
				type: Object,
				default: {}
			}
		},
		computed: {
			...mapGetters([
				'c_provinceArr',
				'c_userInfo',
				'vhl_isShowBox'
				])
		},
		methods: {
			...mapActions([
				'vhl_showBox',
				'c_getProvinceArr'
				]),
			showDeleteBox() {
				this.vhl_showBox({isShow: true, id: this.clubObj.id, lineName: this.clubObj.title})
			},
			querySearch(queryString, cb) {
				if(!queryString) {
			        let results = this.c_provinceArr
			        this.isRcmProvince = true
			        cb(results);
				}else {
					let nowTime = new Date().getTime()
					if(nowTime - this.searchTime < 500) {
						this.searchTime = nowTime
						clearTimeout(this.searchTimer)
						this.searchTimer = setTimeout(() => {
							this.seachGetData(queryString,(restaurants) => {
						        let results = restaurants.filter(this.createFilter(queryString));
						        this.isRcmProvince = false
						        cb(results);
							})
						},500 - (nowTime - this.searchTime))
					}else {
						this.searchTime = nowTime
						this.seachGetData(queryString,(restaurants) => {
						    let results = restaurants.filter(this.createFilter(queryString));
						    this.isRcmProvince = false
						    cb(results);
						})
					}	
				}
		    },
		    createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
		        };
		    },
		    handleSelect(item) {
		        this.$confirm(`<p>将路书 <b>${this.clubObj.title}</b> 推荐给 <b>${item.name}</b></p>` , '' , {
		        	dangerouslyUseHTMLString: true,
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消'
		        }).then(() => {
		        	if(this.isRcmProvince) {
		        		this.getClub(this.clubObj.id, item.id, 2)
		        	}else {
		        		this.getClub(this.clubObj.id, item.id, 1)
		        	}
		        	this.state = ''
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消推荐',
		            center: true
		          });
		        });
		    },
		    getClub(routeId, selfId, type) {
		    	const $this = this
		    	this.$api.ajax({
		    		url: config.clubRecommend,
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						routeId: routeId,
						bizid: selfId,
						type: type
					},
					success: (res) => {
						if(res.code == 0) {
							this.$message({
						        type: 'success',
						        message: '线路推荐成功',
						        center: true
						    });
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
					},
					error: (err) => {
						this.$message({
					        type: 'error',
					        message: '线路推荐失败',
					        center: true
					    });
					}
		    	})
		    },
		    seachGetData(keyword,callback) {
		    	const $this = this
		    	this.$api.ajax({
		    		url: config.getAllClub,
		    		method: "POST",
		    		headers: {
						'Content-Type':'application/x-www-form-urlencoded',
						'API-User-Token': $this.c_userInfo.token
					},
					params: {
						keyword: keyword
					},
					success: (res) => {
						if(res.code == 0) {
							if(res.data.length != 0) {
								let arr = []
								res.data.map((v,i) => {
									arr.push({
										name: v.clubName,
										id: v.clubId
									})
								})
								typeof callback == 'function' && callback(arr)
							}else {
								this.$message({
							        type: 'info',
							        message: '未获取到相关自驾团',
							        center: true
							    });
							}
						}else {
							this.$message({
						        type: 'error',
						        message: res.message,
						        center: true
						    });
						}
					},
					error: (err) => {
						this.$message({
					        type: 'error',
					        message: '自驾团获取失败',
					        center: true
					    });
					}
		    	})
		    } 
		},
		mounted() {
			if(this.c_provinceArr.length == 0) {
				this.$api.provinceList((data) => {
					this.c_getProvinceArr(data)
				})
			}
	    }
	}
</script>

<style scoped>
	.clubRcm {
		width: auto;
		height: auto;
		display: flex;
		position: relative;
	}
	.clubRcmInput {
		margin-right: 10px;
	}
	.clubRcmInput>p {
		display: block;
		text-align: right;
		font-size: 12px;
		color: #FFCF74;
		margin-top: 5px;
	}
	.clubRcmInput>p>span:hover {
		cursor: pointer;
	}
</style>