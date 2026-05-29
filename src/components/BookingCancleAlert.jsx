"use client";

import { authClient } from "@/lib/auth-client";
import { TrashBin } from "@gravity-ui/icons";
import {AlertDialog, Button} from "@heroui/react";
import { router } from "better-auth/api";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export function BookingCancelAlert({ bookingId }) {
  console.log(bookingId);


  const handleCancelBooking = async () => {
      const{data:tokenData}=await authClient.token()
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/${bookingId}`,{
      method:'DELETE',
      headers:{
        'content-type': 'application/json',
         authorization:`Bearer ${tokenData?.token}`
      }
        
    })
    const data = await res.json()
    window.location.reload();

      // if (res.ok) {
      //   toast.success("Booking cancelled");
      //   close();
      //   router.refresh();
      // } else {
      //   toast.error(data.message || "Failed to cancel booking");
      // }

   
   

  }
  return (
    <AlertDialog>
     <Button variant="outline" className={'rounded-none text-red-500'}><TrashBin></TrashBin>Cancel</Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Cancel Booking permanently?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
             
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button onClick={handleCancelBooking} slot="close" variant="danger">
               Delete
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}