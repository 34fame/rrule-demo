<template>
   <q-page padding>
      <!--
            <div style="max-width: 800px; width: 100%;">
               <div class="row items-center bg-primary text-white">
                  <q-btn
                     flat
                     color="white"
                     icon="fas fa-chevron-left"
                     style="height: 100%"
                     @click="onPrev"
                  />
                  <transition :name="transition" appear>
                     <div :key="parsedStart.date" class="row justify-between items-center text-white"
                          style="width: calc(100% - 112px)">
                        <div v-for="day in days" :key="day.date" class="col-auto" :style="dayStyle">
                           <q-btn flat :class="dayClass(day)" style="line-height: unset;"
                                  @click="selectedDate = day.date; transition = ''">
                              <div class="text-center" style="width: 100%;">{{ monthFormatter(day, true) }}</div>
                              <div class="text-center text-bold" style="width: 100%;  font-size: 16px;">
                                 {{ dayFormatter(day, false) }}
                              </div>
                              <div class="text-center" style="width: 100%; font-size: 10px;">{{ weekdayFormatter(day, true)
                                 }}
                              </div>
                           </q-btn>
                        </div>
                     </div>
                  </transition>
                  <q-btn flat color="white" icon="fas fa-chevron-right" style="height: 100%" @click="onNext"/>
               </div>
               <q-calendar
                  v-model="selectedDate"
                  view="day"
                  hide-header
                  bordered
                  :interval-height="50"
                  :interval-start="7"
                  locale="en-us"
                  style="height: 400px; border-top: none;"
               />
            </div>
      -->
      <div class="q-pa-md row full-width">
         <div
            class="full-width"
            v-for="(day, index) in Object.keys(remindersGrouped)"
            :key="index"
         >
            <div
               v-for="(time, index) in Object.keys(remindersGrouped[day])"
               :key="index"
            >
               <q-banner class="bg-grey-4 text-grey-7">
                  <span class="text-body1">{{day + ' at ' + time}}</span>
               </q-banner>
               <q-list bordered separator>
                  <q-item
                     v-for="(schedule,index) in remindersGrouped[day][time]"
                     :key="index"
                  >
                     <q-item-section>
                        <q-item-label>
                           {{schedule.descr}}
                        </q-item-label>
                     </q-item-section>
                  </q-item>
               </q-list>
            </div>
         </div>
      </div>
   </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'
import moment from 'moment'
import { rrulestr } from 'rrule'
import QCalendar from '@quasar/quasar-ui-qcalendar'
import _ from 'lodash'

const CURRENT_DAY = new Date()

function getCurrentDay(day) {
   const newDay = new Date(CURRENT_DAY)
   newDay.setDate(day)
   const tm = QCalendar.parseDate(newDay)
   return tm.date
}

export default {
   data() {
      return {
         raw_data: [],
         reminders: [],
         remindersGrouped: {},
         selectedDate: getCurrentDay(CURRENT_DAY.getDate()),
         weekdays: [0, 1, 2, 3, 4, 5, 6],
         locale: 'en-us',
         monthFormatter: this.monthFormatterFunc(),
         dayFormatter: this.dayFormatterFunc(),
         weekdayFormatter: this.weekdayFormatterFunc(),
         transitionPrev: 'slide-right',
         transitionNext: 'slide-left',
         transition: '',
      }
   },

   computed: {
      weekdaySkips() {
         return QCalendar.getWeekdaySkips(this.weekdays)
      },

      parsedStart() {
         if (this.selectedDate) {
            return QCalendar.getStartOfWeek(QCalendar.parseTimestamp(this.selectedDate), this.weekdays, this.today)
         }
         return void 0
      },

      parsedEnd() {
         if (this.selectedDate) {
            return QCalendar.getEndOfWeek(QCalendar.parseTimestamp(this.selectedDate), this.weekdays, this.today)
         }
         return void 0
      },

      today() {
         const newDay = new Date(CURRENT_DAY)
         const tm = QCalendar.parseDate(newDay)
         return tm
      },

      days() {
         if (this.parsedStart && this.parsedEnd) {
            return QCalendar.createDayList(
               this.parsedStart,
               this.parsedEnd,
               this.today,
               this.weekdaySkips,
            )
         }
         return []
      },

      dayStyle() {
         return {
            width: 100 / this.weekdays.length + '%',
         }
      },
   },

   methods: {
      getNextFive(reminder) {
         return reminder.rrule.all(function(date, i) {
            return i < 5
         })

      },

      groupByDate(reminders) {
         let newReminders = []
         reminders.map((reminder,ri) => {
            let rule = reminder.rrule
            let jsNow = moment.utc().toDate()
            let jsMonth = moment.utc().add(1, 'M').toDate()
            let upcoming = rule.between(
               jsNow,
               jsMonth
            )
            upcoming.map((timestamp, ti) => {
               let mDate = moment.utc(timestamp).format('L')
               let mTime = moment.utc(timestamp).format('LT')
               newReminders.push({
                  id: ri+ti,
                  descr: reminder.descr,
                  date: mDate,
                  time: mTime,
               })
            })

         })
         newReminders = _.sortBy(newReminders, ['date', 'time'])
         let groupedDate = _.groupBy(newReminders, 'date')
         let groupedDateTime = _.forEach(groupedDate, function(value, key) {
            groupedDate[key] = _.groupBy(groupedDate[key], function(item) {
               return item.time
            })
         })
         this.remindersGrouped = groupedDateTime
      },

      loadReminders() {
         if (SessionStorage.isEmpty()) {
            SessionStorage.set('reminders', [])
            this.raw_data = []
         } else {
            this.raw_data = SessionStorage.getItem('reminders')
         }
      },

      onPrev() {
         const ts = QCalendar.addToDate(this.parsedStart, { day: -7 })
         this.selectedDate = ts.date
         this.transition = 'q-transition--' + this.transitionPrev
      },

      onNext() {
         const ts = QCalendar.addToDate(this.parsedStart, { day: 7 })
         this.selectedDate = ts.date
         this.transition = 'q-transition--' + this.transitionNext
      },

      dayClass(day) {
         return {
            row: true,
            'justify-center': true,
            'selected-date': this.selectedDate === day.date,
         }
      },

      monthFormatterFunc() {
         const longOptions = { timeZone: 'UTC', month: 'long' }
         const shortOptions = { timeZone: 'UTC', month: 'short' }

         return QCalendar.createNativeLocaleFormatter(
            this.locale,
            (_tms, short) => short ? shortOptions : longOptions,
         )
      },

      weekdayFormatterFunc() {
         const longOptions = { timeZone: 'UTC', weekday: 'long' }
         const shortOptions = { timeZone: 'UTC', weekday: 'short' }

         return QCalendar.createNativeLocaleFormatter(
            this.locale,
            (_tms, short) => short ? shortOptions : longOptions,
         )
      },

      dayFormatterFunc() {
         const longOptions = { timeZone: 'UTC', day: '2-digit' }
         const shortOptions = { timeZone: 'UTC', day: 'numeric' }

         return QCalendar.createNativeLocaleFormatter(
            this.locale,
            (_tms, short) => short ? shortOptions : longOptions,
         )
      },
   },

   watch: {
      raw_data: function(raw_data) {
         raw_data.map(reminder => {
            let rule = rrulestr(reminder.rruleString)
            this.reminders.push({ descr: reminder.descr, rrule: rule })
         })
      },

      reminders: function(value) {
         this.groupByDate(value)
      }
   },

   beforeMount() {
      this.loadReminders()
   },
}
</script>

<style lang="sass" scoped>
.title-bar
   width: 100%
   height: 70px
   display: flex
   flex-direction: row
   flex: 1

.selected-date
   color: $secondary
   background: white
</style>
