import { Router } from "express";
import {
  getChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.route("/").get(getChats).post(createChat);
router.route("/:id").get(getChatById).put(updateChat).delete(deleteChat);

export default router;
