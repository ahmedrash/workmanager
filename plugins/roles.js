export default ({ app }, inject) => {
  inject('roles', (lvl1, lvl2, lvl3, df, authUser) => {
	

	if(authUser.role_list == undefined){
        if(lvl2 == 'none'){
          return false
        }
        else{
          return true
        }

      }

	let permission, permission1, permission2, permission3, permission4
	let rt1, rt2, rt3, rt4, rt5
	
	permission = authUser.role_list.filter(e=>{
	  return e.id == lvl1
	})[0]

	permission1 = permission.subitems.filter(e=>{
	  return e.id == lvl2
	})[0]

	if(lvl2 == 'partial'){
	  permission2 = permission1.view.filter(e=>{
		return e.id == lvl3
	  })[0]
	  rt1 = permission1?permission1.status:false
	  rt2 = permission2?permission2.status:false
	}
	else{
	  rt1 = permission1?permission1.status:false
	}

	if(df == 'item'){
	  permission3 = permission.subitems.filter(e=>{
		return e.id == 'none'
	  })[0]
	  permission4 = permission.subitems.filter(e=>{
		return e.id == 'full'
	  })[0]
	  rt4 = permission3?permission3.status:false
	  rt5 = permission4?permission4.status:false
	}

	if(df == 'page'){
	  permission3 = permission.subitems.filter(e=>{
		return e.id == 'partial'
	  })[0]
	  if(permission3){
		permission4 = permission3.view.filter(e=>{
		  return e.id == 'view'
		})[0]
	  }
	  rt4 = permission3?permission3.status:false
	  rt5 = permission4?permission4.status:false
	}



	if(df == 'page' && lvl2 == 'none'){
	  if(rt1 == true){
		return true
	  }
	  else{
		if(rt4 == true && rt5 == true){
		  return false
		}
		if(rt4 == false){
		  return false
		}
	  }
	}

	if(df == 'page' && lvl2 == 'full'){
	  if(rt1 == true){
		return true
	  }
	  else{
		if(rt4 == true && rt5 == true){
		  return true
		}

		if(rt4 == false){
		  return false
		}
	  }
	}

	if(df == 'item' && lvl2 == 'partial'){
	  if(rt1 == true && rt2 == true){
		return true
	  }
	  else{
		if(rt5 == true){
		  return true
		}

		if(rt4 == false){
		  return false
		}
	  }
	}
	})
}
