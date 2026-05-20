const Testimonials = () => {
  const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'University Student',
    content: 'Booking a study room for our group project was seamless! The Wi-Fi speed and whiteboard facilities were perfect for our needs.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Software Developer',
    content: 'I needed a distraction-free space for a deep-work coding session. The Quiet Zone room was incredibly peaceful with excellent amenities.',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Book Club Organizer',
    content: 'We regularly host our monthly book club discussions here. The booking process is fast, and the room ambiance is highly comfortable.',
    rating: 5,
  },
  {
    name: 'Robert Wilson',
    role: 'PhD Researcher',
    content: 'Highly recommend these rooms for academic research. The smart projector setup and calm environment allowed me to focus for hours.',
    rating: 5,
  },
];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-yellow-400 ${i < rating ? 'fill-current' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="py-20 bg-base-200/50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-12">
          What Our Clients Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <p className="text-base-content/70 text-center mb-6 italic">
                  {testimonial.content}
                </p>
                
                <div className="text-center">
                  <h4 className="font-semibold text-primary">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-base-content/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;