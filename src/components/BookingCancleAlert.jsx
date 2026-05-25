"use client";

import { TrashBin } from "@gravity-ui/icons";
import {AlertDialog, Button} from "@heroui/react";

export function BookingCancelAlert({ bookingId }) {
  console.log(bookingId);
  const handleCancelBooking = async() => {
    const res = await fetch(`http://localhost:5000/booking/${bookingId}`,{
      method:'DELETE',
      headers:{
      'content-type':'application/json'
      }
    })
    const data = await res.json()
    window.location.reload()
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