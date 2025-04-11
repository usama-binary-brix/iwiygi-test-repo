"use client";
import BackStep from "@/components/backStep/BackStep";
import MiniListView from "@/components/generic/MiniListView";
import { useGetAllAdminOrdersQuery, useGetStripeBalanceQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const {
    data: allOrders,
    error,
    isLoading,
  } = useGetAllAdminOrdersQuery({ page, limit });

  const {
    data: balance,
    error:balanceerror,
    isLoading:balanceLoading,
  } = useGetStripeBalanceQuery(null);

  const totalItems = allOrders?.data.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleRowClick = (val: any) => {
    const itemPrice = Number(val.itemPrice) || 0;

    if (itemPrice == 0) {
      toast.error("Seller has not created the invoice yet.");
      return;
    }

    router.push(`/manage-orders/${val.id}`);
  };

  return (
    <>
      <div className="container-fluid mx-3">
        <div className="text-2xl sm:text-3xl font-bold mb-4 flex gap-3 justify-between items-center mt-3">
          <BackStep href="/" />
          <span>Manage Orders</span>
          <div>
          <p className="text-sm">
  <span className="text-bright-green">Available Balance : </span> 
  $ {(balance?.availableBalanceInDollars)?.toFixed(2)}
</p>
<p className="text-sm">
  <span className="text-bright-green">Pending Balance : </span> 
  $ {(balance?.pendingBalanceInDollars)?.toFixed(2)}
</p>

          </div>
        </div>

        <div className="grid grid-cols-1">
          <div className="overflow-x-auto mb-16">
            <table className="table border-2 border-[#343434] rounded w-full">
              <thead className="text-[#03F719] font-bold bg-[#343434] rounded">
                <tr>
                  <th className="text-start text-[16px] p-2">Order no.</th>
                  <th className="text-start text-[16px] p-2">Item</th>
                  <th className="text-start text-[16px] p-2">Order Status</th>
                  <th className="text-start text-[16px] p-2">Payment Status</th>
                  <th className="text-start text-[16px] p-2">Payout Status</th>

                  <th className="text-start text-[16px] p-2">Total Price</th>
                </tr>
              </thead>
              <tbody className="text-[#959595] text-base">
                {allOrders?.data?.invoices?.map((val: any, ind: any) => (
                  <tr
                    className="border-b border-[#343434] cursor-pointer"
                    key={ind}
                    // onClick={() => router.push(`/manage-orders/${val.id}`)}
                    onClick={() => handleRowClick(val)}
                  >
                    <td className="p-3 text-sm">Order # - {val.id}</td>
                    <td className="p-3 text-sm">
                      <MiniListView
                        title={val?.listing?.title}
                        img={val?.listing?.featuredImage}
                        imgClassName="h-[35px] min-w-[55px] max-w-[45px]"
                        mainClassName="border-none"
                      />
                    </td>
                    <td className="p-3 text-sm capitalize">
                      {val.orderStatus.toLowerCase()}
                    </td>
                    <td className="p-3 text-sm capitalize">
                      {val.paymentStatus.toLowerCase() || "--"}
                    </td>
                    <td className="p-3 text-sm capitalize">
                      {val?.payoutStatus.toLowerCase() || "--"}
                    </td>
                    <td className="p-3 text-sm">
                      ${" "}
                      {(Number(val.itemPrice) || 0) +
                        (Number(val.shipmentAmount) || 0) +
                        (Number(val.stateTaxAmount) || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalItems > 0 && (
              <div className="flex flex-col md:flex-row gap-5 justify-center items-center mt-4 md:float-right">
                <div className="text-white-700">
                  <label htmlFor="itemsPerPage" className="mr-2">
                    Items per page:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    {[10, 15, 20].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-dark-green text-black rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
