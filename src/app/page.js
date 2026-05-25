import Banner from "@/components/Banner";
import LatestRooms from "@/components/LatestRoom";
import Testimonials from "@/components/Testimonial";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <LatestRooms></LatestRooms>
      <Testimonials></Testimonials>
  </div>
  );
}
