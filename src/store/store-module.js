import * as api from 'src/helpers/api'
import { currentTime } from 'src/helpers/time'
import { uid } from 'src/helpers/uid'
import { sortObject, filterArray, filterArchived, groupArray } from 'src/helpers/sort'
import Vue from 'vue'

const MODULE = 'module-name'

const state = {
   items: {},
   filterBy: '',
   groupBy: '',
   showArchived: false,
   sortFields: ['project', 'severity', 'created'],
}

const mutations = {
   addItem: (state, payload) => {
      Vue.set(state.items, payload.id, payload.item)
   },

   updateItem: (state, payload) => {
      Object.assign(state.items[payload.id], payload.updates)
   },

   setItems: (state, value) => {
      state.items = value
   },

   setSortFields: (state, value) => {
      state.sortFields = value
   },

   setFilterBy: (state, value) => {
      state.filterBy = value
   },

   setGroupBy: (state, value) => {
      state.groupBy = value
   },
}

const getters = {
   sorted: (state, getters) => {
      let items = getters.sorted
      let all = sortObject(items, state.sortFields)
      if (state.showArchived) {
         return all
      } else {
         return filterArchived(all)
      }
   },

   filtered: (state, getters) => {
      let items = []
      items = getters.sorted
      return filterArray(items, state.filterBy)
   },

   filteredByProject: (state, getters) => (project) => {
      let items = getters.sorted
      return filterArray(items, project, ['project'])
   },

   grouped: (state, getters) => {
      let items = getters.filtered
      return groupArray(items, state.groupBy)
   },

   categoryList: (state, getters) => {
      let items = getters.noArchives
      let res = []
      items.map(item => {
         if (!res.includes(item.category)) {
            res.push(item.category)
         }
      })
      return res
   },
}

const actions = {
   async getItems({ commit }) {
      let result = await api.getItems(MODULE)
      if (result.success) {
         let payload = {}
         result.data.map(item => {
            payload[item.id] = item
         })
         commit('setItems', payload)
      } else {
         return false
      }
   },

   async createItem({ commit }, item) {
      const id = uid({})
      let payload = {
         id,
         item: {
            ...item,
            id,
            created: currentTime(),
         },
      }
      let result = await api.createItem(MODULE, payload.item)
      if (result.success) {
         commit('addItem', payload)
         return result.data
      } else {
         return false
      }
   },

   async updateItem({ state, commit }, props) {
      const { id, updates } = props
      let payload = {
         id,
         updates: {
            ...updates,
            updated: currentTime(),
         },
      }
      let result = await api.updateItem(MODULE, id, payload.updates)
      if (result.success) {
         commit('updateItem', props)
         return true
      } else {
         return false
      }
   },

   async deleteItem({ commit, dispatch }, id) {
      let result = await api.deleteItem(MODULE, id)
      if (result.success) {
         dispatch('getItems')
         return true
      } else {
         return false
      }
   },
}

export default {
   namespaced: true,
   state,
   mutations,
   getters,
   actions,
}
