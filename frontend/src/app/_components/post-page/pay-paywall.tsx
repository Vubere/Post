"use client";

import { usePayPaywallFeeMutation, useReadPostMutation } from "@/app/_lib/api/post";
import InView from "../in-view";
import { useMemo, useState } from "react";
import { Modal } from "antd";
import { ROUTES } from "@/app/_lib/routes";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const PayPaywall = ({ id, paywallFee, className, cb }: { id: string, paywallFee: string, className?: string, cb?: () => void }) => {
  const router = useRouter();
  const [payPaywallFee] = usePayPaywallFeeMutation();

  const confirmPayment = () => {
    Modal.confirm({
      title: `Pay one time fee of ${paywallFee} collects`,
      cancelText: "Cancel",
      okText: "Pay",
      onOk: () => {
        payPaywallFee({
          id: id
        }).then(res => {
          if (res.data?.status === "success") {
            toast.success("Payment successful");
            cb ? cb() : window.location.reload();
          }
          else {
            toast.error("Payment failed");
          }
        }).catch(() => toast.error("Payment failed"));
      },
    })
  }

  return (
    <button className={` ${className}`} onClick={confirmPayment}>Pay {paywallFee} collects</button>
  )
}

export default PayPaywall;
