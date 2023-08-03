const bookStatus = Object.freeze({
  ACTIVE: 'draft',
  INACTIVE: 'published'
})

const genders = Object.freeze({
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
})

const bloodGroups = Object.freeze({
  O_POS: 'O+',
  O_NEG: 'O-',
  A_POS: 'A+',
  A_NEG: 'A-',
  B_POS: 'B+',
  B_NEG: 'B-',
  AB_POS: 'AB+',
  AB_NEG: 'AB-'
})

export default {
  bookStatus,
  genders,
  bloodGroups
}
