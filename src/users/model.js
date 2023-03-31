import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const UsersModel = sequelize.define("user", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.TEXT(20),
    allowNull: false,
  },
  surname: {
    type: DataTypes.TEXT(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT(70),
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
    type: DataTypes.TEXT(22),
    allowNull: false,
  },
  website: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  area: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
export default UsersModel;
