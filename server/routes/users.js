import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
} from "../controllers/usersController.js";

import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/", authenticate, authorize("Administrator"), getUsers);
router.get("/:id", authenticate, authorize("Administrator"), getUser);

router.post("/", authenticate, authorize("Administrator"), createUser);
router.put("/:id", authenticate, authorize("Administrator"), updateUser);

export default router;