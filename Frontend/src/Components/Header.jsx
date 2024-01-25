import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsChevronDown } from "react-icons/bs";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { keepOpen, openPanel } from "../features/auth/sidePanelSlice";
import { BiHelpCircle } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Head() {
  const navigate = useNavigate();
  let pageUrls = [
    "Department_Info",
    "Lab_Details",
    "Purchase_Details",
    "Invoice",
    "Equipments_Info",
    "Equipments_Issues",
    "Equipments_Review",
    "Experiment_Form",
    "Apparatus_Details",
  ];
  let dispatch = useDispatch();
  let user = useSelector((store) => {
    return store.user;
  });
  async function help() {
    if (
      user?.role.toLowerCase() == "staff" ||
      user?.role.toLowerCase() == "incharge"
    ) {
      navigate("/help/incharge");
    } else if (
      user?.role.toLowerCase() == "admin" ||
      user?.role.toLowerCase() == "hod" ||
      user?.role.toLowerCase() == "foreman"
    ) {
      navigate("/help/admin");
    }
  }

  const nav = useNavigate();
  let headerDisplay;
  if (user.status) {
    headerDisplay = true;
  } else {
    headerDisplay = false;
  }

  if (user.role?.toLowerCase() === "admin") {
    pageUrls = pageUrls.filter((item) => {
      return true;
    });
  } else if (user.role?.toLowerCase() === "incharge") {
    pageUrls = pageUrls.filter((item) => {
      if (item == "Equipments_Issues" || item == "Equipments_Review")
        return true;
    });
  } else if (user.role?.toLowerCase() == "staff") {
    pageUrls = pageUrls.filter((item) => {
      if (item == "Experiment_Form" || item == "Apparatus_Details") return true;
    });
  } else if (user.role?.toLowerCase() === "hod") {
    pageUrls = pageUrls.filter((item) => {
      return true;
    });
  } else if (user.role?.toLowerCase() == "foreman") {
    pageUrls = pageUrls.filter((item) => {
      if (
        item == "Purchase_Details" ||
        item == "Invoice" ||
        item == "Equipments_Info"
      )
        return true;
    });
  }

  return (
    <>
      {headerDisplay && (
        <main
          className={`sticky z-50 flex flex-col md:flex-row items-center justify-between w-full py-2 shadow-lg space-x-3 bg-slate-50 ${
            (user?.role.toLowerCase() == "admin" && "bg-purple-300") ||
            (user?.role.toLowerCase() == "hod" && "bg-green-300") ||
            (user?.role.toLowerCase() == "staff" && "bg-lime-200")
          }`}
        >
          <div className="flex flex-col items-center justify-center md:flex-row md:justify-start">
            <img
              onClick={() => nav("/")}
              src={require("../img/GAT-logo.png")}
              alt="college logo"
              className="w-12 cursor-pointer ml-9"
            />
            <button
              className="ml-6 py-2 font-bold px-3 capitalize hover:shadow-md rounded-md hover:bg-[#010b4b] hover:text-white transition ease-in-out"
              onClick={() => dispatch(keepOpen()) && nav("/dashboard")}
            >
              {user.role}'s Dashboard
            </button>
          </div>
          <div className="text-lg font-semibold text-center md:text-left whitespace-nowrap md:static">
            Global Academy Of Technology
          </div>
          <div className="flex items-center cursor-pointer">
            <Link className="px-2" to="/search">
              {" "}
              <FiSearch className="cursor-pointer" />
            </Link>
            <Link className="px-2" to="/depreciation">
              <FaRupeeSign />
            </Link>

            <div className="px-2">
              <BiHelpCircle className="text-2xl" onClick={() => help()} />
            </div>
            {user?.role.toLowerCase() != "hod" && (
              <DropDown pageUrls={pageUrls} />
            )}
            <div className="px-3">
              <CgProfile
                onClick={() => {
                  nav("/profile");
                }}
                className="text-3xl cursor-pointer"
              />
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export function DropDown(prop) {
  const nav = useNavigate();
  const { pageUrls } = prop;
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50">
          Forms{" "}
          <BsChevronDown
            className="w-5 h-5 -mr-1 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-5 bg-white shadow-lg w-42 origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="flex flex-col items-center justify-center py-1">
            {pageUrls.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={() => nav(`${item}`)}
                    className={classNames(
                      active ? "text-gray-900 bg-gray-100" : "text-gray-700",
                      "block w-full px-4 py-2 text-sm"
                    )}
                  >
                    {item}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default Head;
