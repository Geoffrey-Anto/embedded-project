"use client";
// pages/index.js
import React, { useEffect, useState } from "react";
import "../designcss/payment.css"; // Make sure to link to the correct path of your CSS file
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

const Payment = () => {
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
              <img className="image" src="./image copy.png"></img>
            </div>

            <div className="rechargediv">
              <div className="account-balance">
                Account Balance
                <div className="amt">₹ {userData.balance}</div>
                <div className="blank"></div>
                <div className="recharge">Recharge Amount</div>
                <div className="rechargeamt">
                  <div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.post("/person/recharge", {
                            amount: 250,
                          });
                          alert("Recharged successfully");
                          getMyInfo();
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      className="btn"
                    >
                      250
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.post("/person/recharge", {
                            amount: 500,
                          });
                          alert("Recharged successfully");
                          getMyInfo();
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      className="btn"
                    >
                      500
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.post("/person/recharge", {
                            amount: 1000,
                          });
                          alert("Recharged successfully");
                          getMyInfo();
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      className="btn"
                    >
                      1000
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
