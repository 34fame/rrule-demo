<template>
   <q-layout view="hHh lpR fFf">
      <!--Header-->
      <q-header elevated>
         <q-toolbar style="height: 96px;">
            <q-btn
               flat
               dense
               round
               icon="menu"
               aria-label="Menu"
               @click="mini = !mini"
            />

            <div class="q-mx-lg">
               <q-icon
                  class="cursor-pointer"
                  name="fas fa-rocket"
                  color="white"
                  size="md"
               />
            </div>

            <q-toolbar-title class="text-h6 white">
               Scheduler App
            </q-toolbar-title>

            <div>Quasar v{{ $q.version }}</div>
         </q-toolbar>
      </q-header>

      <!--Menu-->
      <q-drawer
         class="q-mt-sm"
         v-model="left"
         show-if-above
         bordered
         content-class="bg-grey-1"
         :mini="mini"
      >
         <q-list>
            <q-item clickable :to="{name: 'home'}">
               <q-item-section avatar>
                  <q-icon name="home"/>
               </q-item-section>
               <q-item-section>
                  <q-item-label>Home</q-item-label>
               </q-item-section>
            </q-item>

            <q-item clickable :to="{name: 'reminders'}">
               <q-item-section avatar>
                  <q-icon name="notifications"/>
               </q-item-section>
               <q-item-section>
                  <q-item-label>Reminders</q-item-label>
               </q-item-section>
            </q-item>
         </q-list>
      </q-drawer>

      <!--Content-->
      <q-page-container>
         <router-view/>
      </q-page-container>

      <!--Footer-->
      <div class="lt-md">
         <q-footer elevated>
            <q-tabs class="bg-grey-9 text-grey-1">
               <q-route-tab
                  icon="home"
                  :to="{name: 'home'}"
               />
               <q-route-tab
                  icon="notifications"
                  :to="{name: 'reminders'}"
               />
            </q-tabs>
         </q-footer>
      </div>
   </q-layout>
</template>

<script>
export default {

   data() {
      return {
         left: false,
         mini: true,
      }
   },
}
</script>
