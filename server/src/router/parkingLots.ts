import { Router } from "express";
import prisma from "../db";

const parkingLotsRouter = Router();

parkingLotsRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

parkingLotsRouter.get("get-all", async (req, res) => {
  const parkingLots = await prisma.parkingLot.findMany();
  res.json(parkingLots);
});

parkingLotsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const parkingLot = await prisma.parkingLot.findUnique({
    where: {
      id: id,
    },
  });
  res.json(parkingLot);
});

parkingLotsRouter.post("/car-in", async (req, res) => {
  const { personId, parkingLotId } = req.body;
  const parkingLot = await prisma.parkingLot.findUnique({
    where: {
      id: parkingLotId,
    },
    include: {
      users: true,
    },
  });

  if (!parkingLot) {
    return res.status(400).json({
      message: "Parking lot not found",
      success: false,
    });
  }

  await prisma.parkingLot.update({
    where: {
      id: parkingLotId,
    },
    data: {
      used: parkingLot.used + 1,

      available: parkingLot.used === parkingLot.capacity ? false : true,
    },
  });

  await prisma.person.update({
    where: {
      id: personId,
    },
    data: {
      parkingLotId: parkingLotId,
      startTime: new Date().toISOString(),
    },
  });

  res.json({
    message: "Car in",
    success: true,
  });
});

parkingLotsRouter.post("/car-out", async (req, res) => {
  const { personId, parkingLotId } = req.body;
  const parkingLot = await prisma.parkingLot.findUnique({
    where: {
      id: parkingLotId,
    },
    include: {
      users: true,
    },
  });

  if (!parkingLot) {
    return res.status(400).json({
      message: "Parking lot not found",
      success: false,
    });
  }

  prisma.parkingLot.update({
    where: {
      id: parkingLotId,
    },
    data: {
      used: parkingLot.used - 1,
      available: true,
    },
  });

  await prisma.person.update({
    where: {
      id: personId,
    },
    data: {
      parkingLotId: null,
      startTime: null,
    },
  });

  res.json({
    message: "Car out",
    success: true,
  });
});

export default parkingLotsRouter;
