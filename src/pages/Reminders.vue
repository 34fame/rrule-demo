<template>
   <q-page padding>
      <div class="row q-gutter-md">
         <q-btn
            class="bg-grey-7 text-white"
            label="Delete Reminders"
            v-if="selected.length"
            @click="handleDelete()"
         />
      </div>

      <div class="q-mt-lg">
         <q-table
            :columns="columns"
            :data="data"
            :grid="$q.screen.xs"
            row-key="id"
            title="Reminders"
            selection="multiple"
            :selected.sync="selected"
         />
      </div>

      <div class="q-mt-xl q-mx-xl">
         <span class="text-h6">Reminder Form</span>
         <q-form
            class="q-gutter-md"
            @reset="handleReset"
            @submit="handleSave"
         >
            <q-input
               filled
               label="Description"
               v-model="formData.descr"
            />

            <q-input
               autogrow
               filled
               label="RRule String"
               v-model="formData.rruleString"
            />

            <q-input
               label="RRule Text"
               readonly
               v-model="formData.rruleText"
            />

            <q-input
               autgrow
               label="Sample Schedule"
               readonly
               type="textarea"
               v-model="formData.rruleSample"
            />

            <q-btn
               color="primary"
               :disable="!formData.descr || !formData.rruleText.length"
               label="Save"
               type="submit"
            />

            <q-btn
               color="primary"
               flat
               label="Reset"
               type="reset"
            />
         </q-form>
      </div>
   </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'
import { rrulestr } from 'rrule'

export default {
   data() {
      return {
         data: [],
         columns: [
            { name: 'id', label: 'ID', field: 'id' },
            { name: 'descr', label: 'Description', field: 'descr' },
            { name: 'rruleText', label: 'Schedule', field: 'rruleText' },
         ],
         selected: [],
         formData: {
            id: '',
            descr: '',
            rrule: {},
            rruleString: '',
            rruleText: '',
            rruleSample: '',
         },
      }
   },

   methods: {
      handleSave() {
         let reminders = SessionStorage.getItem('reminders')
         let exists = false
         let nextId = 1

         reminders.map((reminder,idx) => {
            if (reminder.id >= nextId) nextId = reminder.id + 1

            if (reminder.id === this.formData.id) {
               exists = idx
            }
         })

         if (exists) {
            reminders[exists] = this.formData
         } else {
            let item = {
               id: nextId,
               descr: this.formData.descr,
               rruleString: this.formData.rruleString,
               rruleText: this.formData.rruleText,
            }
            reminders.push(item)
         }

         SessionStorage.set('reminders', reminders)
         this.loadReminders()
         this.handleReset()
      },

      handleDelete() {
         let reminders = SessionStorage.getItem('reminders')
         this.selected.map(selection => {
            reminders.map((reminder,idx) => {
               if (reminder.id === selection.id) {
                  reminders.splice(idx, 1)
               }
            })
         })
         SessionStorage.set('reminders', reminders)
         this.loadReminders()
         this.handleReset()
         this.selected = []
      },

      handleReset() {
         this.formData.id = ''
         this.formData.descr = ''
         this.formData.rruleString = ''
         this.formData.rrule = {}
         this.formData.rruleText = ''
         this.formData.rruleSample = ''
      },

      loadReminders() {
         if (SessionStorage.isEmpty()) {
            SessionStorage.set('reminders', [])
            this.data = []
         } else {
            this.data = SessionStorage.getItem('reminders')
         }
      },
   },

   watch: {
      'formData.rruleString': function(value) {
         if (!value.length) {
            this.formData.rrule = {}
            this.formData.rruleText = ''
            this.formData.rruleSample = ''
            return false
         }

         const rule = rrulestr(value)
         if (rule) {
            this.formData.rrule = rule
            this.formData.rruleText = rule.toText()
            let sampling = rule.all(function(date, i) {
               return i < 5
            })
            this.formData.rruleSample = sampling.join("\n")
         } else {
            this.formData.rrule = {}
            this.formData.rruleText = ''
            this.formData.rruleSample = ''
         }
      },

      selected: function(value) {
         console.log("selected", value)
         if (value.length === 1) {
            this.formData = {
               id: value[0].id,
               descr: value[0].descr,
               rruleString: value[0].rruleString,
            }
            return false
         }
         this.handleReset()
      },

      formData: function(value) {
         console.log("formData", value)
      }
   },

   beforeMount() {
      this.loadReminders()
   },
}
</script>

<style scoped>

</style>
