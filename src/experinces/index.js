import Express from "express";
import ExperiencesModel from "./model.js";
import createHttpError from "http-errors";
import UsersModel from "../users/model.js";

const experiencesRouter = Express.Router();

experiencesRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const { experienceId } = await ExperiencesModel.create({
      ...req.body,
      userId: req.params.userId,
    });
    res.status(201).send({ experienceId });
  } catch (error) {
    next(error);
  }
});

experiencesRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const experiences = await ExperiencesModel.findAll({
      where: { userId: req.params.userId },
      attributes: { exclude: ["userId"] },
      include: [
        { model: UsersModel, attributes: ["userId", "name", "surname"] },
      ],
    });
    res.send(experiences);
  } catch (error) {
    next(error);
  }
});

experiencesRouter.get("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const experiences = await ExperiencesModel.findByPk(req.params.expId);
    if (experiences) {
      res.send(experiences);
    } else {
      next(
        createHttpError(
          404,
          `Experience with id ${req.params.expId} was not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

experiencesRouter.put("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const [numberOfUpdatedExp, updatedExp] = await ExperiencesModel.update(
      req.body,
      { where: { experienceId: req.params.expId }, returning: true }
    );
    if (numberOfUpdatedExp === 1) {
      res.send(updatedExp[0]);
    } else {
      next(
        createHttpError(
          404,
          `Experience with id ${req.params.expId} was not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

experiencesRouter.delete(
  "/:userId/experiences/:expId",
  async (req, res, next) => {
    try {
      const numberOfDeletedRows = await ExperiencesModel.destroy({
        where: { experienceId: req.params.expId },
      });
      if (numberOfDeletedRows === 1) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.expId} was not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default experiencesRouter;
