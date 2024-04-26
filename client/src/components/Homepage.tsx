"use client";
// pages/index.js
import React, { useEffect, useState } from "react";
import "../designcss/home.css"; // Make sure to link to the correct path of your CSS file
import Link from "next/link";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
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

const HomePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

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
          <div className="nav-user">{userData.name}</div>
        </nav>

        <div className="main-content">
          <div className="maindiv">
            <div>
              <h1 className="text-3xl text-center">Parking Details</h1>
              <iframe
                className="mt-2"
                width="550"
                height="300"
                src={`https://maps.google.com/maps?width=100%25&height=300&hl=en&q=${
                  userData.ParkingLot ? userData.ParkingLot.address : ""
                }&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
              ></iframe>{" "}
            </div>

            <div className="accountdiv">
              <div className="repark">
                <img src="./image.png"></img>
              </div>

              <div className="accountdiv">
                <div className="not-parked">
                  {!userData.parkingLotId ? (
                    <p className="text-center">Not parked yet!</p>
                  ) : (
                    <p className="text-center">
                      Parked from {new Date(userData.startTime).getHours()}:
                      {new Date(userData.startTime).getMinutes()}{" "}
                    </p>
                  )}
                </div>
              </div>

              <div className="account-balance">
                Account Balance
                <div className="amt">₹ {userData.balance}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
