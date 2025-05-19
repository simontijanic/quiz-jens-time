const router = require("express").Router();
const adminController = require("../controllers/adminController");
const requireAdmin = require("../utils/requireAdmin");

router.get("/admin", requireAdmin, adminController.getAdminDashboard);
router.post("/admin/user/:userId/role", requireAdmin, adminController.updateUserRole);

module.exports = router;