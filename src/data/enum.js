const bookStatus = Object.freeze({
  ACTIVE: 'draft',
  INACTIVE: 'published',
})

const genders = Object.freeze({
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
})

module.exports = {
  bookStatus,
  genders,
}
