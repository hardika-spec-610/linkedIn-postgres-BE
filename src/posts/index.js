import Express from "express";
import PostsModel from "./model.js";
import UsersModel from "../users/model.js";

const postsRouter = Express.Router();

postsRouter.post("/", async (req, res, next) => {
  try {
    const { postId } = await PostsModel.create(req.body);
    res.status(201).send({ postId });
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostsModel.findAll({
      attributes: ["postId", "text", "image"],
      include: [
        { model: UsersModel, attributes: ["userId", "name", "surname"] },
      ],
    });
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await PostsModel.findByPk(req.params.postId, {
      attributes: { exclude: ["userId"] },
      include: [
        { model: UsersModel, attributes: ["userId", "name", "surname"] },
      ],
    });
    if (post) {
      res.send(post);
    } else {
      next(
        createHTTPError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.put("/:postId", async (req, res, next) => {
  try {
    const [numberOfUpdatedPosts, updatedPosts] = await PostsModel.update(
      req.body,
      { where: { postId: req.params.postId }, returning: true }
    );
    if (numberOfUpdatedPosts === 1) {
      res.send(updatedPosts[0]);
    } else {
      next(
        createHTTPError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await PostsModel.destroy({
      where: { postId: req.params.postId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHTTPError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default postsRouter;
