"use client";

import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaRegCheckCircle } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "sonner";
import ConfirmationModal from "./ConfirmationModal";

interface UserProfileProps {
  userid: string;
  username: string;
  fullName?: string; // Full name of the user
  email: string; // Email address of the user
  showDeleteButton: boolean;
  // isActive: boolean; // Activation status of the user
  //   onActivateToggle: () => void; // Function to handle activation toggle
  //   onDelete: () => void; // Function to handle delete action
}

const UserProfile: React.FC<UserProfileProps> = ({
  userid,
  username,
  fullName,
  email,
  showDeleteButton,
  // isActive,
  //   onActivateToggle,
  //   onDelete,
}) => {
  const [modalLoading, setModalLoading] = useState(false);
  const handleDeleteUser = async (userId: string) => {
    setModalLoading(true);

    try {
      let current_user: any = localStorage.getItem("User");
      current_user = JSON.parse(current_user);
      let accessToken = localStorage.getItem("accessToken");
      if (!accessToken || (current_user && current_user.role !== "admin")) {
        toast.error("You haven't permission to access this section");
        return;
      }
      await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/admin/deleteUserWithListing/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((data) => data.json())
        .then((data) => {
          if (data.status == 200) {
            setModalLoading(false);

            toast.success(data.message);
          } else {
            setModalLoading(false);

            toast.error(data.message);
          }
        });
    } catch (error) {
      setModalLoading(false);

      toast.error("Something Went Wrong");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => () => {});

  const [deleteMessage, setDeleteMessage] = useState<string>("");

  const handleDelete = (id: string, type: "user") => {
    let deleteAction: any;
    let message = "";

    if (type === "user") {
      deleteAction = () => handleDeleteUser(id);
      message = "Are you sure you want to delete this user?";
    }
    setDeleteAction(() => deleteAction);
    setDeleteMessage(message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    await deleteAction();
    setIsModalOpen(false);
    // fetchAllUsers()
    window.location.reload();
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 rounded shadow-md w-[250px]">
        <div className="">
          <CgProfile className="w-12 h-12 text-gray-200" />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-bold text-bright-green text-[10px]">
            {fullName ? fullName : username}
          </h2>

          <p className="text-sm text-white text-[10px] break-words w-[150px]">{email}</p>
          <div className="flex gap-2">
            {showDeleteButton && (
              <button
                // onClick={onDelete}
                onClick={() => handleDelete(userid, "user")}
                className="px-2 py-1 mt-2 text-sm rounded bg-red-800 text-white"
              >
                {modalLoading ? "Processing..." : "Delete User"}
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message={deleteMessage}
        loading={modalLoading}
      />
    </>
  );
};

export default UserProfile;
