"use client";
import React, { useEffect, useState } from "react";
import "../designcss/parking.css";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
  id: number;
  name: string;
  email: string;
  balance: number;
  parkingLotId: number;
  startTime: string;
  ParkingLot: {
    id: number;
    name: string;
    users: { id: number; name: string }[];
    capacity: number;
    available: boolean;
    used: number;
    price: number;

    address: string;
  };
}

const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours}:${minutes}`;
};

const Parking = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const [nextParkingSlot, setNextParkingSlot] = useState<string>("");

  const getMyInfo = async () => {
    try {
      const res = await api.get("/person/me");
      console.log(res);
      setUserData(res.data.person);
    } catch (error) {
      console.error(error);
      router.push("/login");
    }
  };

  useEffect(() => {
    getMyInfo();
    const res = generateRandomTime();
    setNextParkingSlot(res);
    // is res already in local storage then set state as that or else generate random time and save it in local storage

    if (!localStorage.getItem("nextParkingSlot")) {
      localStorage.setItem("nextParkingSlot", res);
      setNextParkingSlot(res);
      return;
    }

    setNextParkingSlot(localStorage.getItem("nextParkingSlot")!);
  }, []);

  if (!userData) {
    return <h1>Loading...</h1>;
  }

  console.log(userData);

  return (
    <div className="background">
      <div className="layouter">
        <nav className="navbar">
          {/* Add navigation items here */}
          <Link href={"/dashboard"} className="nav-item">
            Home
          </Link>
          <Link href={"/parking"} className="nav-item">
            Parking
          </Link>
          <Link href={"/payment"} className="nav-item">
            Payments
          </Link>
          {/* <div className="nav-user">Username</div>*/}
        </nav>

        <div className="main-content">
          <div className="maindiv">
            <div>
              <div className="container">
                <button className="btn">
                  <span>View Parking Location</span>
                  <i className="material-icons"></i>
                  <ul className="dropdown">
                    <li>
                      <a href="#">Previous parking Location</a>
                    </li>
                    <li>
                      <a href="#">Current Parking Location</a>
                    </li>
                    <li>
                      <a href="#">View Parking Lot</a>
                    </li>
                  </ul>
                </button>
              </div>
              <iframe
                className="mt-2"
                width="550"
                height="300"
                src={`https://maps.google.com/maps?width=100%25&height=300&hl=en&q=${
                  userData.ParkingLot ? userData.ParkingLot.address : ""
                }&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
              ></iframe>{" "}
            </div>

            {
              <div className="accountdiv">
                <div className="account-balance">
                  New Parking Slot Available in
                  <div className="amt">{nextParkingSlot}</div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parking;
