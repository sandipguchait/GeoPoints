const user = {
  _id: "1",
  name: "Sandip",
  email: "sandip@gmail.com",
  picture: "https://cloudinary.com/asdf"
}

module.exports = {
  Query: {
    me: () => user
  }
}