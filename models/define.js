const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        login_id: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        color: {
          type: DataTypes.STRING(128),
          allowNull: true,
        },
        nickname: {
          type: DataTypes.STRING(256),
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "user",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    User.hasMany(models.Question, { foreignKey: "questioned_user_id" });
  }
}

class Question extends Model {
  static init(sequelize) {
    super.init(
      {
        question_id: {
          //해당 질문세트 아이디
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        questioned_user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "User",
            key: "user_id",
          },
        },
        author_nickname: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        assigned_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(2048),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "question",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Question.belongsTo(models.User, { foreignKey: "questioned_user_id" });
    Question.hasMany(models.Answer, { foreignKey: "question_id" });
  }
}

class Answer extends Model {
  static init(sequelize) {
    super.init(
      {
        answer_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        question_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Question",
            key: "question_id",
          },
        },
        content: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        img_url: {
          type: DataTypes.STRING(1024),
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "answer",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Answer.belongsTo(models.Question, { foreignKey: "question_id" });
  }
}

module.exports = { User, Question, Answer };
