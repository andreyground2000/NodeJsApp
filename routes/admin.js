const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
const requireRole = require("../middleware/reiquire-role");

// /admin/add-product => GET
router.get(
  "/add-product",
  isAuth,
  requireRole("admin"),
  adminController.getAddProduct
);

// // /admin/products => GET
router.get(
  "/products",
  isAuth,
  requireRole("admin"),
  adminController.getProducts
);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  requireRole("admin"),
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  requireRole("admin"),
  isAuth,
  adminController.getEditProduct
);

router.post(
  "/edit-product",
  isAuth,
  requireRole("admin"),
  adminController.postEditProduct
);

router.post(
  "/delete-product",
  isAuth,
  requireRole("admin"),
  adminController.postDeleteProduct
);

module.exports = router;
