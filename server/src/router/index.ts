import { Router } from "express";
import personRouter from "./person";
import parkingLotsRouter from "./parkingLots";

const apiRouter = Router();

apiRouter.use("/person", personRouter);
apiRouter.use("/parking-lots", parkingLotsRouter);

export default apiRouter;
