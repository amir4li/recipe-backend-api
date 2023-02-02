const Recipe = require("../models/recipeModel");
const asyncHandler = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../utils/errorResponse");


// @desc      Get all recipes
// @route     GET /api/v1/recipes
// @access    Public
exports.getAllRecipes = asyncHandler(async (req, res)=> {
    // BUILD QUERY
    console.log(req.query)
    const query = Recipe.find(req.query);

    // EXECUTE QUERY
    const recipes = await query;

    // SEND RESPONSE
    console.log("Data sent successfully");
    res.status(200).json({
        status: "success",           
        results: recipes.length,
        data: recipes
    });
});


// @desc      Get user's recipes
// @route     GET /api/v1/recipes/user-recipes
// @access    Public
exports.getUserRecipes = asyncHandler(async (req, res)=> {
    // BUILD QUERY
    const query = Recipe.find({ user: req.user.id });

    // EXECUTE QUERY
    const recipes = await query;

    // SEND RESPONSE
    console.log("Data sent successfully");
    res.status(200).json({
        status: "success",           
        results: recipes.length,
        data: recipes
    });
});


// @desc      Get single recipe
// @route     GET /api/v1/recipes/:id
// @access    Public
exports.getRecipe = asyncHandler(async (req, res, next)=> {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
    };

    res.status(200).json({
        status: "success",
        data: recipe
    });
});


// @desc      Create new recipe
// @route     POST /api/v1/recipes/:id
// @access    Private
exports.createRecipe = asyncHandler(async (req, res)=> {
    // Add user to req.body
    req.body.user = req.user.id;
    

    // Creating new recipe
    const newRecipe = await Recipe.create(req.body);

    res.status(201).json({
        status: "success",
        msg: "New Recipe has been created",
        data: newRecipe
    });
});


// @desc      Update recipe
// @route     PUT /api/v1/recipes/:id
// @access    Private
exports.updateRecipe = asyncHandler(async (req, res, next)=> {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
    };

    // Make sure user is owns the recipe
    if (recipe.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this recipe`, 401));
    };

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        msq: `Update recipe ${req.params.id}`,
        data: recipe
    });
});


// @desc      Delete recipe
// @route     DELETE /api/v1/recipes/:id
// @access    Private
exports.deleteRecipe = asyncHandler(async (req, res, next)=> {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
    };

    // Make sure user is owns the recipe
    if (recipe.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this recipe`, 401));
    };

    recipe.remove();

    res.status(204).json({
        status: "success",
        data: {}
    });
});


