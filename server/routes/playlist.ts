import { Router, Request, Response } from "express";
import { fetchAparatPlaylist } from "../services/aparatService.js";

const router = Router();

/**
 * POST /api/playlist
 * Request body: { url: string }
 */
router.post("/playlist", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "لطفاً لینک یا شناسه پلی‌لیست آپارات را وارد کنید.",
      });
    }

    const data = await fetchAparatPlaylist(url);
    return res.json(data);
  } catch (err: any) {
    console.error("API Playlist Error:", err);
    const status = err.message?.includes("یافت نشد") ? 404 : 400;
    return res.status(status).json({
      error: err.message || "خطایی در پردازش پلی‌لیست رخ داد.",
    });
  }
});

export default router;
