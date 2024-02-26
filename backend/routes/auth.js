import express from "express";
import csrf from "csurf";
import {
  allUsers,
  deleteUser,
  forgotPassword,
  getUserDetails,
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUser,
  uploadAvatar,
} from "../controllers/authControllers.js";
const router = express.Router();

import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

//CSRF protection
const csrfProtection = csrf({ cookie: true });
router.route("/getCSRFToken").get(csrfProtection, (req, res) => {
  res.send({ csrfToken: req.csrfToken() });
});

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router
  .route("/me/update")
  .put(isAuthenticatedUser, csrfProtection, updateProfile);
router
  .route("/password/update")
  .put(isAuthenticatedUser, csrfProtection, updatePassword);
router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;
