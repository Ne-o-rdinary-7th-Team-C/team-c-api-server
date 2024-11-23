const db = require("./models");

db.User.create({
  login_id: "test",
  password: "test",
  color: "#000000",
  nickname: "테스트",
})
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
