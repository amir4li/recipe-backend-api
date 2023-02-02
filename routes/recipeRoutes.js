const express = require("express");
const recipeController = require("../controllers/recipeController");
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();


router.route("/")
    .get(recipeController.getAllRecipes)
    .post(protect, recipeController.createRecipe);

router.route("/user-recipes")
    .get(protect, recipeController.getUserRecipes);

router.route("/:id")
    .get(recipeController.getRecipe)
    .put(protect, recipeController.updateRecipe)
    .delete(protect, recipeController.deleteRecipe);

module.exports = router;

