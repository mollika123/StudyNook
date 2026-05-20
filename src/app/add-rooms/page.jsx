"use client"

import { FieldError, Input, Label, TextField, Select, ListBox, TextArea, Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";

const amenitiesOptions = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];
const AddRoomsPage = () => {
  const router = useRouter();
    const onSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const rooms = Object.fromEntries(formData.entries())
rooms.amenities = formData.getAll('amenities');
        console.log('rooms',rooms)

         const res=await fetch('http://localhost:5000/rooms', {
      method: 'POST',
      headers: {
        'content-type':'application/json'
      },
      body:JSON.stringify(rooms)
   })
    const data = await res.json();
      console.log(data);
      
      if(res.ok){
        router.push("/");
      }
  }

    

    return (
        <div className="p-5 max-w-7xl mx-auto">
         <h1 className="text-2xl font-bold">Add Rooms</h1>

         <Card className="shadow-xl">
        <form
        onSubmit={onSubmit}
            className="p-7 space-y-8  w-3xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Destination Name */}
              <div className="md:col-span-2">
                <TextField name="roomName" isRequired>
                  <Label>Room Name</Label>
                  <Input placeholder="Enter room name" className="rounded-2xl" />
                  <FieldError />
                </TextField>
              </div>

              {/* Country */}
              <TextField name="floor" isRequired>
                <Label>Floor</Label>
                <Input placeholder="3rd Floor" className="rounded-2xl" />
                <FieldError />
              </TextField>

                 {/* Amenities */}
          <div>
            <Label className="mb-3 block font-medium">Amenities</Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {amenitiesOptions.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2  rounded-2xl p-3 shadow cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    className="checkbox rounded-2xl"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

                 {/* Capacity */}
          <TextField name="capacity" type="number" isRequired>
            <Label>Capacity</Label>
            <Input type="number" placeholder="4" min="1" />
            <FieldError />
          </TextField>

              {/* Price */}
              <TextField name="hourlyRate" type="number" isRequired>
                <Label>Hourly Rate (USD)</Label>
                <Input
                  type="number" min="1"
                  placeholder="5"
                  className="rounded-2xl"
                />
                <FieldError />
              </TextField>

              {/* Duration */}
              {/* <TextField name="duration" isRequired>
                <Label>Duration</Label>
                <Input
                  placeholder="7 Days / 6 Nights"
                  className="rounded-2xl"
                />
                <FieldError />
              </TextField> */}

              {/* Departure Date */}
              {/* <div className="md:col-span-2">
                <TextField name="departureDate" type="date" isRequired>
                  <Label>Departure Date</Label>
                  <Input type="date" className="rounded-2xl" />
                  <FieldError />
                </TextField>
              </div> */}

              {/* Image URL - Removed preview */}
              <div className="md:col-span-2">
                <TextField name="imageUrl" isRequired>
                  <Label>Image URL</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/bali-paradise.jpg"
                    className="rounded-2xl"
                  />
                  <FieldError />
                </TextField>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <TextField name="description" isRequired>
                  <Label>Description</Label>
                  <TextArea
                    placeholder="Describe the travel experience..."
                    className="rounded-3xl"
                  />
                  <FieldError />
                </TextField>
              </div>
            </div>

            {/* Buttons */}

            <Button
              type="submit"
              variant="outline"
              className=" rounded-full w-full bg-cyan-500 text-white"
            >
             Add Rooms
            </Button>
          </form>
         </Card>
        </div>
    );
};

export default AddRoomsPage;