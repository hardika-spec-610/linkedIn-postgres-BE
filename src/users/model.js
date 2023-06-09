import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import PostsModel from "../posts/model.js";
import ExperiencesModel from "../experinces/model.js";

const UsersModel = sequelize.define("user", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(70),
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    get: function () {
      return JSON.parse(this.getDataValue("address"));
    },
    set: function (value) {
      return this.setDataValue("address", JSON.stringify(value));
    },
  }, //The address attribute is defined as a JSONB column, which allows us to store an object as a JSON string in the database.
  //We also define get and set methods to automatically parse and stringify the JSON object when reading from or writing to the database.
  phoneNumber: {
    type: DataTypes.STRING(22),
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

UsersModel.hasMany(ExperiencesModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});
ExperiencesModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

UsersModel.hasMany(PostsModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});
PostsModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

//where a user can have multiple posts, and each post belongs to a single user.
//We're also specifying that when a user is deleted, all their related posts should be deleted automatically using onDelete: "CASCADE".
//This means that if we delete a user record, all their related posts will also be deleted automatically, without needing to delete them explicitly.
export default UsersModel;
