const _random = (min, max) => {
   return Math.floor(Math.random() * (max - min)) + min
}

const uid = props => {
   const {
      characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      length = 6,
      prefix = "",
      regexp = "^[A-Z]",
   } = props

   const regex = RegExp(regexp)
   let uid = ""

   while (uid.length < length || !regex.test(uid)) {
      if (uid.length === length) {
         uid = ""
      }
      uid = uid + characters[_random(0,characters.length-1)]
   }
   return prefix + uid
}

export { generateUid }
