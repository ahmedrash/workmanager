<template>
  <div class="date_picker_block d-inline">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="450"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
          <div class="d-inline" style="line-height: 32px;">
            <v-btn color="gray" v-bind="attrs" v-on="on" :icon="saved==''" :text="saved!=''" plain :small="saved!=''" v-if="saved==''">
            <v-icon :small="saved==''" :x-small="saved!=''">{{saved!=''?'ri-close-line':'ri-calendar-line'}}</v-icon> {{saved}}
            </v-btn>

            <v-btn color="error" icon plain x-small v-if="saved!=''" @click="removeenddate()">
            <v-icon x-small>ri-close-line</v-icon>
            </v-btn>

            <v-btn color="primary" v-bind="attrs" v-on="on" text plain x-small v-if="saved!=''" class="pl-0">
            <span class="float-left">{{saved}}</span>
            </v-btn>
          </div>
        
      </template>

      <v-card>
        <v-container class="date_container">
          <v-row>
            <v-col>
              <div class="dateinput" :class="getClass(1)">
                <input
                  type="text"
                  v-model="start_date_time"
                  placeholder="Start Date"
                  class="pa-0"
                  @focus="updatefocus(1, 'focus')"
                  @blur="updatefocus(1, 'blur')"
                />
                <v-icon
                  x-small
                  v-if="start_date_time != ''"
                  class="mx-1"
                  @click="removedate(0)"
                  >ri-close-circle-line</v-icon
                >
                <!-- <input type="text" v-if="start_date!=''" placeholder="Add Time" class="pa-0" @focus="focus1=true" @blur="focus1=false" @contextmenu="show(1)"> -->
                <div
                  v-if="start_date_time != '' && start_time == ''"
                  class="d-flex"
                >
                  <v-menu offset-y content-class="white">
                    <template v-slot:activator="{ on, attrs }">
                      <input
                        type="text"
                        v-model="start_time"
                        v-bind="attrs"
                        v-on="on"
                        placeholder="Add Time"
                        class="pa-0"
                        @focus="updatefocus(1, 'focus')"
                        @blur="updatefocus(1, 'blur')"
                      />
                    </template>
                    <v-list :max-height="400" :min-width="100">
                      <v-list-item
                        v-for="(item, index) in times()"
                        :key="index"
                        link
                        @click="updateTime(0, item)"
                      >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-col>
            <v-col>
              <div class="dateinput" :class="getClass(2)">
                <input
                  type="text"
                  v-model="end_date_time"
                  placeholder="End Date"
                  class="pa-0"
                  @focus="updatefocus(2, 'focus')"
                  @blur="updatefocus(2, 'blur')"
                />
                <v-icon
                  x-small
                  v-if="end_date_time != ''"
                  class="mx-1"
                  @click="removedate(1)"
                  >ri-close-circle-line</v-icon
                >
                <!-- <input type="text" v-if="end_date!=''" placeholder="Add Time" class="pa-0" @focus="focus2=true" @blur="focus2=false" @contextmenu="show(2)"> -->
                <div
                  v-if="end_date_time != '' && end_time == ''"
                  class="d-flex"
                >
                  <v-menu offset-y content-class="white">
                    <template v-slot:activator="{ on, attrs }">
                      <input
                        type="text"
                        v-model="end_time"
                        v-bind="attrs"
                        v-on="on"
                        placeholder="Add Time"
                        class="pa-0"
                        @focus="updatefocus(2, 'focus')"
                        @blur="updatefocus(2, 'blur')"
                      />
                    </template>
                    <v-list :max-height="400" :min-width="100">
                      <v-list-item
                        v-for="(item, index) in times()"
                        :key="index"
                        link
                        @click="updateTime(1, item)"
                      >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>

        <v-row>
          <v-col class="pr-0 fixedtime_block">
            <v-list flat dense class="py-0">
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item v-for="(item, i) in fixedtime()" :key="i" @click="setdatetime(item)">
                  <v-list-item-content>
                    <v-list-item-title class="d-flex justify-space-between"
                      ><span>{{ item.text }}</span
                      ><span class="grey--text lighten-3">{{
                        item.info
                      }}</span></v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>

          <v-col class="pl-0">
            <v-date-picker no-title range v-model="picker"></v-date-picker>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn  @click="menu = false" small text color="warning darken-3"> Cancel </v-btn>
          <v-btn color="success darken-3" text @click="save()" small> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import moment from "moment";
export default {
    props: ["entry", "collection", "authUser", "short"],
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    picker: [],
    selectedItem: 1,
    focus1: true,
    focus2: false,
    start_date_time: "",
    end_date_time: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    showtime1: false,
    showtime2: false,
    items: [
      { text: "Today", ins: ["add", 0, "days", "ddd"] },
      { text: "Later", ins: ["add", 6, "hours", "h:mm a"] },
      { text: "Tomorrow", ins: ["add", 1, "days", "ddd"] },
      { text: "This weekend", ins: ["endOf", 0, "weeks", "ddd"] },
      { text: "Next week", ins: ["startOf", 1, "weeks", "ddd"] },
      { text: "Next weekend", ins: ["endOf", 1, "weeks", "ddd"] },
      { text: "2 weeks", ins: ["startOf", 2, "weeks", "MMM DD"] },
      { text: "4 weeks", ins: ["startOf", 4, "weeks", "MMM DD"] },
    ],
    saved:''
  }),
  watch: {
    picker(val) {
      //console.log(val);
      this.updatepicker(val)
    },
    entry(val){
        this.updateonload()
    }
  },
  created(){
    this.updateonload()
  },
  methods: {
      updateonload(){
          if(this.entry.schedule){
              if(this.entry.scheduletime){
                  this.start_time = this.entry.scheduletime[0]
                this.end_time = this.entry.scheduletime[1]
              }
              
              this.picker = this.entry.schedule
              this.updatepicker(this.picker)
              this.updatebtn()
          }
      },
      updatepicker(val){
    this.start_date = "";
      this.end_date = "";
      if (val.length == 0) {
        this.start_date = "";
        this.end_date = "";
      }
      if (val[0]) {
        this.start_date = moment(val[0]).format("M/D/YY");
      }

      if (val[1]) {
        this.end_date = moment(val[1]).format("M/D/YY");
      }
       
    if(val[0] && val[1]){
        if (moment(val[0]) < moment(val[1])) {
          this.start_date = moment(val[0]).format("M/D/YY");
          this.end_date = moment(val[1]).format("M/D/YY");
        } else {
          this.start_date = moment(val[1]).format("M/D/YY");
          this.end_date = moment(val[0]).format("M/D/YY");
        }
    }
       

      this.updatedatetime();
      },
      setdatetime(item){
          if(this.focus1){
              this.picker[0] = item.date
              if(item.time != ''){
                  this.start_time = item.time
              }
          }

          if(this.focus2){
              this.picker[1] = item.date
              if(item.time != ''){
                  this.end_time = item.time
              }
          }

          this.updatepicker(this.picker)
      },
    fixedtime() {
      let array = this.items.map((e) => {
        let info = "";
        if (e.ins[0] == "add") {
          info = moment().add(e.ins[1], e.ins[2]);
        }

        if (e.ins[0] == "endOf") {
          info = moment().add(e.ins[1], e.ins[2])
            .endOf('week');
        }

        if (e.ins[0] == "startOf") {
          info = moment().add(e.ins[1], e.ins[2])
            .startOf('week');
        }

        //console.log(info)
        let time = info.format('h:mm a')
        if(e.text != 'Later'){
            time = ''
        }
        // let info1 = {...info}
        let data = {
          text: e.text,
          info: info.format(e.ins[3]),
          date: moment(info).format('YYYY-MM-DD'),
          time: time
        };

        
        return data;
      });

      return array;
    },
    updatedatetime() {
      this.start_date_time = this.start_date;
      this.end_date_time = this.end_date;

      this.start_date_time +=
        this.start_time != "" ? " at " + this.start_time : "";
      this.end_date_time += this.end_time != "" ? " at " + this.end_time : "";
    },
    times() {
      let array = [];
      for (let i = 0; i < 96; i++) {
        let min = i * 15;
        let hours = Math.floor(min / 60);
        let minutes = min % 60;
        let ampm = hours / 12 < 1 ? "am" : "pm";
        hours = hours % 12;
        if (hours == 0) {
          hours = 12;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        array.push(hours + ":" + minutes + " " + ampm);
      }
      return array;
    },
    show(item) {
      if (item == 1) {
        this.showtime1 = true;
      }
      if (item == 2) {
        this.showtime2 = true;
      }
    },
    getClass(i) {
      let classstr = "";
      if (i == 1) {
        if (this.start_date_time != "" && this.start_time == "") {
          classstr += "valued";
        }
        if (this.focus1) {
          classstr += " focused";
        }
      }

      if (i == 2) {
        if (this.end_date_time != "" && this.end_time == "") {
          classstr += "valued";
        }
        if (this.focus2) {
          classstr += " focused";
        }
      }

      return classstr;
    },
    removedate(i) {
      this.picker.splice(i, 1);

      if (i == 0) {
        this.start_time = "";
      }

      if (i == 1) {
        this.end_time = "";
      }

      this.updatedatetime();
    },
    updateTime(i, time) {
      if (i == 0) {
        this.start_time = time;
      }

      if (i == 1) {
        this.end_time = time;
      }

      this.updatedatetime();
    },
    updatefocus(i, type) {
      if (type == "blur") {
        if (this.focus1 && i == 2) {
          this.focus1 = false;
          this.focus2 = true;
        }

        if (this.focus2 && i == 1) {
          this.focus2 = false;
          this.focus1 = true;
        }
      }

      if (type == "focus") {
        if (i == 2) {
          this.focus1 = false;
          this.focus2 = true;
        }

        if (i == 1) {
          this.focus2 = false;
          this.focus1 = true;
        }
      }
    },
    save(){
        let item = {
            _id: this.entry._id,
            schedule: this.picker,
            scheduletime: [this.start_time,this.end_time]
        }

        this.$axios.$post(`/collections/save/${this.collection}?token=${this.authUser.api_key}`,{
        data: item
      })
      .then(response => {
        this.updatebtn()
        this.menu = false
      })
      .catch(error => {
        this.onerror(error)
      })
    },
    removeenddate(){
        this.saved = ''
        this.end_time = ''
        this.picker.splice(1, 1);
        this.updatepicker(this.picker)
        this.focus1 = false;
          this.focus2 = true;
          //console.log(this.picker)
    },
    updatebtn(){
        if(this.short){
            this.saved = moment(this.picker[1]).format('MMM DD')
        }
        else{
            this.saved = moment(this.picker[1]).format('MMM DD, YY')
            this.saved += this.end_time!=''?' '+this.end_time:''
        }
        
    },
    onerror(e){

    }
  },
};
</script>

<style>
.date_picker_block .v-list-item--dense,
.v-list--dense .v-list-item {
  min-height: unset;
}

.date_picker_block .v-date-picker-table {
  height: auto !important;
}

.date_container .dateinput {
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 30px;
  padding: 6px;
  display: flex;
  border-radius: 5px;
  max-width: 192.5px;
}

.date_container input {
  font-size: 12px;
  line-height: 12px;
  font-weight: bold;
  outline: none !important;
  width: auto;
  min-width: unset;
}

.date_container .dateinput.focused {
  border: 1px solid #bbd38b;
}

.date_container .dateinput.valued input {
  max-width: calc(50% - 10px);
}

.fixedtime_block .v-list {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
</style>