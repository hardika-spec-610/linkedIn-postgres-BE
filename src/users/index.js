import Express from "express";
import UsersModel from "./model.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import PostsModel from "../posts/model.js";
import ExperiencesModel from "../experinces/model.js";
import q2s from "query-to-sequelize";

const usersRouter = Express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const { userId } = await UsersModel.create(req.body);
    res.status(201).send({ userId });
  } catch (error) {
    next(error);
  }
});

// usersRouter.get("/", async (req, res, next) => {
//   try {
//     const query = {};
//     const { count, rows } = await UsersModel.findAndCountAll({
//       where: {
//         ...query,
//         ...(req.query.search
//           ? { name: { [Op.iLike]: `%${req.query.search}%` } }
//           : ""),
//       },
//       order: [
//         req.query.columnToSort && req.query.sortDirection
//           ? [req.query.columnToSort, req.query.sortDirection]
//           : ["name", "ASC"],
//       ],
//       offset: req.query.offset,
//       limit: req.query.limit,
//       distinct: true,
//       include: [
//         { model: PostsModel, attributes: ["postId", "text", "image"] },
//         { model: ExperiencesModel, attributes: { exclude: ["userId"] } },
//       ],
//     });

//     const prevOffset = parseInt(req.query.offset) - parseInt(req.query.limit);
//     const nextOffset = parseInt(req.query.offset) + parseInt(req.query.limit);

//     res.send({
//       total: count,
//       pages: Math.ceil(count / req.query.limit),
//       links: {
//         prevLink:
//           prevOffset >= 0
//             ? `${process.env.BE_URL}/users?limit=${req.query.limit}&offset=${prevOffset}`
//             : null,
//         nextLink:
//           nextOffset <= count
//             ? `${process.env.BE_URL}/users?limit=${req.query.limit}&offset=${nextOffset}`
//             : null,
//       },
//       users: rows,
//     });
//   } catch (error) {
//     next(error);
//   }
// });
usersRouter.get("/", async (req, res, next) => {
  try {
    const sequelizeQuery = q2s(req.query);
    console.log("sequelizeQuery", sequelizeQuery);
    const { count, rows } = await UsersModel.findAndCountAll({
      offset: sequelizeQuery.options.offset,
      limit: sequelizeQuery.options.limit,
      sort: sequelizeQuery.options.sort,
      distinct: true,
      // When distinct:true is used in a query, Sequelize will add the DISTINCT keyword to the SQL statement generated,
      // which tells the database to return only the unique values for the specified field.
      include: [
        { model: PostsModel, attributes: ["postId", "text", "image"] },
        { model: ExperiencesModel, attributes: { exclude: ["userId"] } },
      ],
    });

    res.send({
      links: sequelizeQuery.links(process.env.BE_URL + "/users", count),
      count,
      numberOfPages: Math.ceil(count / sequelizeQuery.options.limit),
      users: rows,
    });
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} was not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdatedUsers, updatedUsers] = await UsersModel.update(
      req.body,
      { where: { userId: req.params.userId }, returning: true }
    );
    if (numberOfUpdatedUsers === 1) {
      res.send(updatedUsers[0]);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} was not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfDeletedUsers = await UsersModel.destroy({
      where: { userId: req.params.userId },
    });
    if (numberOfDeletedUsers === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} was not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
const cloudinaryUserUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "LinkedIn-BE-Users",
    },
  }),
}).single("image");

usersRouter.post(
  "/:userId/image",
  cloudinaryUserUploader,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await UsersModel.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      console.log("result", result);
      user.image = result.secure_url;
      console.log("secure_url", result.secure_url);
      await user.save();

      //   return res
      //     .status(200)
      //     .json({ message: "User image updated successfully", user });
      res.send(user);
    } catch (error) {
      return next(error);
    }
  }
);
export default usersRouter;
