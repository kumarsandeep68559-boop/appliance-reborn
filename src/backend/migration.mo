import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type BookingId = Nat;
  type ApplianceType = {
    #WashingMachine;
    #Dryer;
    #Dishwasher;
    #Microwave;
    #Chimney;
    #HobChula;
  };
  type ServiceType = {
    #Repair;
    #Servicing;
    #Installation;
  };
  type BookingStatus = {
    #pending;
    #confirmed;
    #completed;
    #cancelled;
  };
  type Booking = {
    id : BookingId;
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    applianceType : ApplianceType;
    serviceType : ServiceType;
    preferredDate : Text;
    description : Text;
    timestamp : Int;
    status : BookingStatus;
  };

  type Testimonial = {
    id : Nat;
    author : Text;
    content : Text;
    rating : Nat;
    timestamp : Int;
    status : {
      #pending;
      #approved;
      #rejected;
    };
  };

  type OldActor = {
    nextBookingId : BookingId;
    nextTestimonialId : Nat;
    bookings : Map.Map<BookingId, Booking>;
    testimonials : Map.Map<Nat, {
      id : Nat;
      author : Text;
      content : Text;
      rating : Nat;
      timestamp : Int;
    }>;
  };

  type NewActor = {
    nextBookingId : BookingId;
    nextTestimonialId : Nat;
    bookings : Map.Map<BookingId, Booking>;
    testimonials : Map.Map<Nat, Testimonial>;
  };

  public func run(old : OldActor) : NewActor {
    let newTestimonials = old.testimonials.map<Nat, {
      id : Nat;
      author : Text;
      content : Text;
      rating : Nat;
      timestamp : Int;
    }, Testimonial>(
      func(_id, oldTestimonial) {
        {
          id = oldTestimonial.id;
          author = oldTestimonial.author;
          content = oldTestimonial.content;
          rating = oldTestimonial.rating;
          timestamp = oldTestimonial.timestamp;
          status = #approved;
        };
      }
    );
    {
      old with
      testimonials = newTestimonials;
    };
  };
};
