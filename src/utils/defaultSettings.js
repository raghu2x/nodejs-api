const schemaDefault = {
  versionKey: false,
  timestamps: true,
  strictPopulate: false,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id
    },
  },
}

const queryDefault = {
  page: 1,
  size: 99,
  sortBy: null,
  ascending: true,
}

module.exports = {
  schemaDefault,
  queryDefault,
}
