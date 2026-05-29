"use client";

import { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { RiArrowDownSLine } from "react-icons/ri";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

// স্ক্রিনশটের ডার্ক মুডের ডিজাইন ক্লাসেস
const fieldLabelClass = "mb-2 block text-sm font-medium text-stone-400";
const fieldClassName = 
  "h-12 w-full rounded-xl border border-stone-800 bg-[#161714] px-4 text-sm text-stone-200 outline-none transition-all focus:border-amber-600/50 focus:ring-1 focus:ring-amber-600/30 color-scheme-dark";
const timeSelectClassName = `${fieldClassName} appearance-none pr-10`;

// ২৪ ঘণ্টার ড্রপডাউন অপশন লিস্ট তৈরির ফাংশন
const buildHoursOptions = () => {
  const options = [];
  for (let i = 1; i <= 24; i++) {
    const hourStr = i.toString().padStart(2, "0");
    options.push({
      value: hourStr,
      label: `${hourStr}:00`,
    });
  }
  return options;
};

const BookingCard = ({ room }) => {
console.log("room",room);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isLoggedIn=!!user
  console.log(user);
  const roomName = room?.roomName || room?.name || "Quiet Pod 3A";
  const hourlyRate = Number(room?.hourlyRate) || 10; 

  // 📅 ডেট স্টেট: আজকের তারিখ ফরম্যাট করে সেট করা (YYYY-MM-DD)
  const todayDate = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(todayDate);
  
  // টাইম ও নোট স্টেট
  const [startTime, setStartTime] = useState("10"); 
  const [endTime, setEndTime] = useState("12");   
  const [note, setNote] = useState("");

  const hoursOptions = buildHoursOptions();


  // লাইভ টোটাল কস্ট ক্যালকুলেশন
  const totalHours = Number(endTime) - Number(startTime);
  const totalCost = totalHours > 0 ? totalHours * hourlyRate : 0;

  const handleStartTimeChange = (newStart) => {
    setStartTime(newStart);
    if (Number(newStart) >= Number(endTime)) {
      const nextHour = (Number(newStart) + 1).toString().padStart(2, "0");
      setEndTime(nextHour === "25" ? "24" : nextHour);
    }
  };
//   const handleBooking = async () => {
//   const bookingData
// }
const handleBooking = async (e) => {
    // 💡 ১. ফর্ম যাতে পেজ রিফ্রেশ না করে সেজন্য e.preventDefault() যোগ করা হলো
    e.preventDefault(); 

    // 💡 ২. সেফটি চেক: যদি কোনো কারণে ইউজার লগইন না থাকে
    if (!user) {
      toast.error("Please login first to book this room!");
      return;
    }
    
    const bookingData = {
      userId: user?.id,
      userImage: user?.image,
      userName: user?.name,
      roomId: room?._id,
      roomName,
      date: bookingDate, 
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      totalHours,
      totalCost,
      roomImage: room?.imageUrl || room?.image || "",
      // roomImage: room?.imageUrl || room?.image || "",
      note
    };
    
    console.log("Submitting Booking Data:", bookingData);
const{data:tokenData}=await authClient.token()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking`, {
        method: "POST",
        headers: {
          'content-type': 'application/json',
          authorization:`Bearer ${tokenData?.token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await res.json();

      // 💡 ৩. Conflict Check: ব্যাকএন্ড যদি ৪MD (Conflict) স্ট্যাটাস কোড পাঠায়
      if (res.status === 409 || data.conflict) {
        toast.error("This room is already booked for this time slot!");
        return;
      }

      if (res.ok) {
        toast.success('Room booked successfully!');
        setNote(""); // বুকিং শেষ হলে নোট ফিল্ড ক্লিয়ার হবে
        
        // মোডালটি অটো-ক্লোজ করার জন্য উইন্ডো রিফ্রেশ করতে পারেন:
        // window.location.reload(); 
      } else {
        toast.error(data.message || "Booking failed. Please try again.");
      }

    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to connect to the server!");
    }
  };
  return (
    <div>
      <Modal>
        <Button className="rounded-md flex justify-center items-center py-4 bg-blue-600 w-full gap-2 font-bold text-white hover:bg-blue-700">
          Book Now
        </Button>

        <Modal.Backdrop className="bg-black/70 backdrop-blur-sm">
          <Modal.Container placement="center">
            <Modal.Dialog className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-800 bg-[#1c1d1a] p-0 shadow-2xl text-stone-200">
              <Modal.CloseTrigger className="text-stone-400 hover:text-stone-200" />

              <form onSubmit={handleBooking}>
                {/* হেডার */}
                <Modal.Header className="space-y-1 px-6 pb-2 pt-6">
                  <Modal.Heading className="text-xl font-semibold tracking-tight text-stone-100">
                    Book {roomName}
                  </Modal.Heading>
                  <p className="text-sm text-stone-500">
                    Pick a date and time slot. Bookings run on the hour.
                  </p>
                </Modal.Header>

                {/* বডি */}
                <Modal.Body className="space-y-5 px-6 py-4">
                  
                  {/* 📅 ডাইনামিক ডেট ইনপুট (ক্যালেন্ডার আইকন সহ পারফেক্ট ডার্ক ডিজাইন) */}
                  <div>
                    <label className={fieldLabelClass} htmlFor="booking-date">Date</label>
                    <div className="relative">
                      <input
                        id="booking-date"
                        type="date"
                        required
                        min={todayDate} // পেছনের ডেট সিলেক্ট করা যাবে না
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className={`${fieldClassName} block w-full text-left appearance-none`}
                        style={{ colorScheme: "dark" }} // ব্রাউজারের ক্যালেন্ডার পপআপকে ডার্ক মুড করার জন্য
                      />
                    </div>
                  </div>

                  {/* টাইম স্লট */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Time */}
                    <div>
                      <label className={fieldLabelClass} htmlFor="start-time">
                        Start
                      </label>
                      <div className="relative">
                        <select
                          id="start-time"
                          value={startTime}
                          onChange={(e) => handleStartTimeChange(e.target.value)}
                          className={timeSelectClassName}
                        >
                          {hoursOptions.slice(0, -1).map((option) => (
                            <option key={option.value} value={option.value} className="bg-[#1c1d1a]">
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <RiArrowDownSLine className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-stone-500" />
                      </div>
                    </div>

                    {/* End Time */}
                    <div>
                      <label className={fieldLabelClass} htmlFor="end-time">
                        End
                      </label>
                      <div className="relative">
                        <select
                          id="end-time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className={timeSelectClassName}
                        >
                          {hoursOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              disabled={Number(option.value) <= Number(startTime)}
                              className="bg-[#1c1d1a]"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <RiArrowDownSLine className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-stone-500" />
                      </div>
                    </div>
                  </div>

                  {/* স্পেশাল নোট */}
                  <div>
                    <label className={fieldLabelClass} htmlFor="booking-note">
                      Special note (optional)
                    </label>
                    <textarea
                      id="booking-note"
                      rows={3}
                      placeholder="Any setup needed?"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className={`${fieldClassName} h-auto resize-none py-3 placeholder:text-stone-600`}
                    />
                  </div>

                  {/* লাইভ টোটাল কস্ট বক্স */}
                  <div className="flex items-center justify-between rounded-xl bg-[#141512] px-4 py-4 border border-stone-900">
                    <span className="text-sm font-medium text-stone-400">
                      Total cost
                    </span>
                    <span className="text-xl font-bold text-[#c5a159] tracking-tight">
                      ${totalCost}
                    </span>
                  </div>
                </Modal.Body>

                {/* ফুটার বাটন */}
                <Modal.Footer className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
                  <Button
                    slot="close"
                    className="h-11 rounded-xl bg-transparent px-4 text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800/30"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="h-11 rounded-xl bg-[#c5a159] px-6 text-sm font-bold text-stone-950 transition-all hover:bg-[#d6b26a] active:scale-[0.98]"
                  >
                    Confirm Booking
                  </Button>
                </Modal.Footer>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default BookingCard;