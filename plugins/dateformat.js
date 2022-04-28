import Vue from 'vue'
import moment from 'moment'

Vue.filter('datefilter', (value, arg) => {
	if(!value) return moment().format('MM/DD/YYYY')
  if(value) return moment(value).format(arg)
})

Vue.filter('datefilterempty', (value, arg) => {
	if(!value) return ''
  if(value){
		let date = moment(value).format(arg)
		if(date != 'Invalid date'){
			return date
		}
		else{
			return value
		}

	}
})

Vue.filter('phone', (phone) => {
	if(!phone) return 'N/A'
	if(phone){
		let fph = phone.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
		return fph
	}
})

Vue.filter('timefilter', (value, arg) => {
	if(!value) return ''
  if(value){
		let times = value.split(':')
		let ampm = 'am'
		if(times[0] == 0){
			times[0] = 12
		}
		else if(times[0] > 12){
			times[0] = times[0] - 12
			ampm = 'pm'
		}

		return times[0]+':'+times[1]+' '+ampm
	}
})

Vue.filter('phone', function (phone) {
	if(phone == undefined || phone == ''){
		return  ''
	}
	
    return phone.replace(/[^0-9]/g, '')
                .replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '($2) $3-$4');
});
