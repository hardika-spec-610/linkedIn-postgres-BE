import sequelize from "../db.js";
import { DataTypes } from "sequelize";

export const ExperiencesModel = sequelize.define("experience", {
  experienceId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  role: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  area: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
});
export default ExperiencesModel;
