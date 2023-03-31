import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const PostsModel = sequelize.define("post", {
  postId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default PostsModel;
