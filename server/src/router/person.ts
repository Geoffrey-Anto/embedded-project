import { Router } from "express";
import prisma from "../db";

import * as jwt from "jsonwebtoken";

const personRouter = Router();

personRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please provide all fields",
      success: false,
    });
  }

  const result = await prisma.person.create({
    data: {
      name,
      email,
      password,
    },
  });

  result.password = "";

  const token = jwt.sign(
    {
      id: result.id,
      data: result,
    },
    "secret",
    {
      expiresIn: "5h",
    }
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 5,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 5),
    })
    .status(200)
    .json({
      token,
      person: result,
      success: true,
    });
});

personRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide all fields",
      success: false,
    });
  }

  const person = await prisma.person.findFirst({
    where: {
      email,
      password,
    },
  });

  if (!person) {
    return res.status(404).json({
      message: "Person not found",
      success: false,
    });
  }

  person.password = "";

  const token = jwt.sign(
    {
      id: person.id,
      data: person.email,
    },
    "secret",
    {
      expiresIn: "5h",
    }
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 5,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 5),
    })
    .status(200)
    .json({
      token,
      person,
      success: true,
    });
});

personRouter.get("/logout", async (req, res) => {
  res.clearCookie("token").send("Logged out");
});

personRouter.get("/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, "secret") as any;

    const person = await prisma.person.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        ParkingLot: true,
      },
    });

    if (!person) {
      return res.status(404).json({
        message: "Person not found",
        success: false,
      });
    }

    res.status(200).json({
      person,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

personRouter.get("/get-current-parked-lot", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, "secret") as any;

    const person = await prisma.person.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!person) {
      return res.status(404).json({
        message: "Person not found",
        success: false,
      });
    }

    if (!person.parkingLotId) {
      return res.status(404).json({
        message: "Person does not have a parking lot",
        success: false,
      });
    }

    const parkingLot = await prisma.parkingLot.findUnique({
      where: {
        id: person.parkingLotId,
      },
    });

    if (!parkingLot) {
      return res.status(404).json({
        message: "Parking lot not found",
        success: false,
      });
    }

    res.status(200).json({
      parkingLot,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

personRouter.post("/recharge", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, "secret") as any;

    const person = await prisma.person.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!person) {
      return res.status(404).json({
        message: "Person not found",
        success: false,
      });
    }

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Please provide amount",
        success: false,
      });
    }

    await prisma.person.update({
      where: {
        id: decoded.id,
      },
      data: {
        balance: person.balance + amount,
      },
    });

    res.status(200).json({
      message: "Recharged",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

export default personRouter;
