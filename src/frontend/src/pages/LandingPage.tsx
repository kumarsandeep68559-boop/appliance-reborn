import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Shield,
  Star,
  ThumbsUp,
  Wrench,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ApplianceType, ServiceType } from "../backend.d";
import {
  useCreateBooking,
  useGetApprovedTestimonials,
} from "../hooks/useQueries";

const PHONE = "7973858612";

const SERVICES = [
  {
    icon: "🫧",
    name: "Washing Machine",
    type: ApplianceType.WashingMachine,
    desc: "Front-load, top-load, semi-automatic — all brands serviced.",
    tags: ["Drum issues", "Water leaks", "Spin failure"],
  },
  {
    icon: "💨",
    name: "Dryer",
    type: ApplianceType.Dryer,
    desc: "Fast diagnostics and reliable repairs for all dryer models.",
    tags: ["Heating element", "Belt replacement", "Sensor calibration"],
  },
  {
    icon: "🍽️",
    name: "Dishwasher",
    type: ApplianceType.Dishwasher,
    desc: "Restore your dishwasher to factory performance.",
    tags: ["Pump repair", "Door latch", "Drainage fix"],
  },
  {
    icon: "📡",
    name: "Microwave",
    type: ApplianceType.Microwave,
    desc: "Safe, expert microwave repairs with genuine parts.",
    tags: ["Magnetron", "Door switch", "Turntable motor"],
  },
  {
    icon: "🏭",
    name: "Chimney",
    type: ApplianceType.Chimney,
    desc: "Deep cleaning and motor replacement for kitchen chimneys.",
    tags: ["Filter cleaning", "Motor repair", "Baffle filters"],
  },
  {
    icon: "🔥",
    name: "Hob & Chula",
    type: ApplianceType.HobChula,
    desc: "Gas and induction hob repairs, burner cleaning & installation.",
    tags: ["Burner cleaning", "Igniter repair", "Gas leak check"],
  },
];

const TESTIMONIALS_FALLBACK = [
  {
    id: 1n,
    author: "Priya Sharma",
    content:
      "My washing machine was leaking for days. The technician from Appliance Reborn arrived on time, diagnosed the issue in minutes, and had it fixed within an hour. Highly recommended!",
    rating: 5n,
  },
  {
    id: 2n,
    author: "Rajesh Kumar",
    content:
      "Excellent service! Called them for chimney deep cleaning and installation of a new filter. They were professional, clean, and charged a fair price. Will use again.",
    rating: 5n,
  },
  {
    id: 3n,
    author: "Meena Patel",
    content:
      "My microwave stopped heating suddenly. Appliance Reborn fixed the magnetron issue the same day. Great response time and very knowledgeable staff.",
    rating: 4n,
  },
];

const WHY_US = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Same-Day Service",
    desc: "Fast response, often same-day repairs for urgent cases.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "90-Day Warranty",
    desc: "All repairs backed by a 90-day service warranty.",
  },
  {
    icon: <ThumbsUp className="w-6 h-6" />,
    title: "Certified Technicians",
    desc: "Trained, background-verified professionals at your door.",
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Genuine Parts",
    desc: "We use only OEM and manufacturer-approved spare parts.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${
            s <= rating
              ? "fill-orange-500 text-orange-500"
              : "fill-muted text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    applianceType: "" as ApplianceType | "",
    serviceType: "" as ServiceType | "",
    preferredDate: "",
    description: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const createBooking = useCreateBooking();
  const { data: testimonials, isLoading: testimonialsLoading } =
    useGetApprovedTestimonials();

  const displayTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : TESTIMONIALS_FALLBACK;

  function scrollToBooking() {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone ||
      !formData.applianceType ||
      !formData.serviceType ||
      !formData.preferredDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await createBooking.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        applianceType: formData.applianceType as ApplianceType,
        serviceType: formData.serviceType as ServiceType,
        preferredDate: formData.preferredDate,
        description: formData.description,
      });
      setBookingSuccess(true);
      toast.success("Booking submitted! We'll call you shortly.");
    } catch {
      toast.error("Failed to submit booking. Please try again or call us.");
    }
  }

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-hero-bg/95 backdrop-blur-md border-b border-hero-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <a href="/" data-ocid="nav.link" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-orange-500 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Appliance Reborn
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {["Services", "Booking", "Testimonials", "Contact"].map((s) => (
              <a
                key={s}
                href={`#${s.toLowerCase()}`}
                data-ocid={`nav.${s.toLowerCase()}.link`}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {s}
              </a>
            ))}
          </nav>
          <a href={`tel:${PHONE}`} data-ocid="nav.phone.link">
            <Button
              size="sm"
              className="cta-btn border-0 font-semibold gap-2 shadow-orange"
            >
              <Phone className="w-4 h-4" />
              {PHONE}
            </Button>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative pt-16 min-h-[92vh] flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.06 260) 0%, oklch(0.18 0.08 250) 50%, oklch(0.22 0.10 240) 100%)",
        }}
      >
        {/* BG image overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/assets/generated/hero-appliance-reborn.dim_1600x700.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, oklch(0.52 0.18 220) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, oklch(0.65 0.22 45) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-brand-500/20 text-brand-200 border border-brand-500/30 text-xs tracking-widest uppercase">
                Trusted Appliance Experts
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
            >
              Your Appliances,{" "}
              <span style={{ color: "oklch(0.72 0.20 45)" }}>Reborn.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed"
            >
              Expert repair, servicing &amp; installation for washing machines,
              dryers, dishwashers, microwaves, chimneys, hobs &amp; chulas.
              Fast. Reliable. Guaranteed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={scrollToBooking}
                data-ocid="hero.primary_button"
                className="cta-btn border-0 text-base font-bold px-8 py-6 shadow-orange gap-2"
              >
                Book a Service
                <ChevronRight className="w-5 h-5" />
              </Button>
              <a href={`tel:${PHONE}`}>
                <Button
                  size="lg"
                  variant="outline"
                  data-ocid="hero.secondary_button"
                  className="border-white/30 text-white hover:bg-white/10 text-base font-semibold px-8 py-6 gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </Button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-14"
            >
              {[
                { n: "500+", label: "Repairs Done" },
                { n: "6", label: "Appliance Types" },
                { n: "90-Day", label: "Warranty" },
                { n: "4.9★", label: "Avg Rating" },
              ].map((s) => (
                <div key={s.label} className="stat-badge rounded-md px-4 py-2">
                  <div className="font-display font-bold text-xl text-white">
                    {s.n}
                  </div>
                  <div className="text-xs text-white/50">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-40"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* WHY US */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {WHY_US.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="flex items-start gap-4 p-5 rounded-lg border border-border hover:border-brand-500/40 transition-colors"
              >
                <div
                  className="shrink-0 w-11 h-11 rounded-md flex items-center justify-center"
                  style={{
                    background: "oklch(0.52 0.18 220 / 0.1)",
                    color: "oklch(0.44 0.16 220)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 section-alt">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <Badge className="mb-4 bg-brand-100 text-brand-600 border-brand-200 text-xs tracking-widest uppercase">
              What We Fix
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              All Your Appliances,
              <br />
              <span style={{ color: "oklch(0.52 0.18 220)" }}>One Number</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              From washing machines to gas hobs — repair, servicing, and
              installation by certified technicians.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.name} variants={fadeUp}>
                <Card
                  data-ocid={`services.item.${i + 1}`}
                  className="h-full card-lift border-border bg-card group cursor-default"
                >
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{svc.icon}</div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {svc.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {svc.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {svc.tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-100"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {["Repair", "Servicing", "Installation"].map((label) => (
                        <span
                          key={label}
                          className="text-xs text-muted-foreground bg-muted rounded px-2 py-0.5"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT / TECHNICIAN */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className="absolute -top-4 -left-4 w-full h-full rounded-2xl"
                style={{
                  background: "oklch(0.52 0.18 220 / 0.08)",
                  border: "1px solid oklch(0.52 0.18 220 / 0.2)",
                }}
              />
              <img
                src="/assets/generated/technician-repair.dim_800x600.jpg"
                alt="Appliance Reborn technician at work"
                className="relative rounded-xl object-cover w-full max-h-96"
                style={{ objectPosition: "top" }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-brand-100 text-brand-600 border-brand-200 text-xs tracking-widest uppercase">
                About Us
              </Badge>
              <h2 className="font-display text-4xl font-bold text-foreground mb-5">
                We Give Your Appliances a Second Life
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Appliance Reborn was founded on a simple belief: quality repair
                is better than replacement. Our certified technicians bring
                precision, care, and genuine parts to every job — saving you
                money and reducing waste.
              </p>
              <ul className="space-y-3">
                {[
                  "Trained, verified technicians",
                  "Transparent pricing — no hidden charges",
                  "All brands and models covered",
                  "Doorstep service across the city",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle
                      className="w-5 h-5 shrink-0"
                      style={{ color: "oklch(0.52 0.18 220)" }}
                    />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={scrollToBooking}
                data-ocid="about.primary_button"
                className="cta-btn border-0 mt-8 font-bold gap-2 shadow-orange"
              >
                Book a Technician
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-24 section-alt">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-100 text-brand-600 border-brand-200 text-xs tracking-widest uppercase">
              Book Online
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Schedule a Service
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Fill in your details and our team will contact you to confirm the
              appointment.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-border shadow-brand-lg">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {bookingSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      data-ocid="booking.success_state"
                      className="text-center py-12"
                    >
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{
                          background: "oklch(0.52 0.18 220 / 0.1)",
                          border: "2px solid oklch(0.52 0.18 220 / 0.3)",
                        }}
                      >
                        <CheckCircle
                          className="w-10 h-10"
                          style={{ color: "oklch(0.52 0.18 220)" }}
                        />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                        Booking Confirmed!
                      </h3>
                      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                        Thank you! We&apos;ve received your request and will
                        call you at{" "}
                        <span className="font-semibold text-foreground">
                          {formData.phone}
                        </span>{" "}
                        to confirm the appointment.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setBookingSuccess(false);
                          setFormData({
                            name: "",
                            phone: "",
                            email: "",
                            address: "",
                            applianceType: "",
                            serviceType: "",
                            preferredDate: "",
                            description: "",
                          });
                        }}
                        data-ocid="booking.secondary_button"
                      >
                        Book Another Service
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            data-ocid="booking.name.input"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                name: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            data-ocid="booking.phone.input"
                            placeholder="10-digit mobile"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                phone: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            data-ocid="booking.email.input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            data-ocid="booking.address.input"
                            placeholder="Your area/locality"
                            value={formData.address}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                address: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>Appliance Type *</Label>
                          <Select
                            value={formData.applianceType}
                            onValueChange={(v) =>
                              setFormData((p) => ({
                                ...p,
                                applianceType: v as ApplianceType,
                              }))
                            }
                          >
                            <SelectTrigger data-ocid="booking.appliance.select">
                              <SelectValue placeholder="Select appliance" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ApplianceType.WashingMachine}>
                                Washing Machine
                              </SelectItem>
                              <SelectItem value={ApplianceType.Dryer}>
                                Dryer
                              </SelectItem>
                              <SelectItem value={ApplianceType.Dishwasher}>
                                Dishwasher
                              </SelectItem>
                              <SelectItem value={ApplianceType.Microwave}>
                                Microwave
                              </SelectItem>
                              <SelectItem value={ApplianceType.Chimney}>
                                Chimney
                              </SelectItem>
                              <SelectItem value={ApplianceType.HobChula}>
                                Hob / Chula
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Service Type *</Label>
                          <Select
                            value={formData.serviceType}
                            onValueChange={(v) =>
                              setFormData((p) => ({
                                ...p,
                                serviceType: v as ServiceType,
                              }))
                            }
                          >
                            <SelectTrigger data-ocid="booking.service.select">
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ServiceType.Repair}>
                                Repair
                              </SelectItem>
                              <SelectItem value={ServiceType.Servicing}>
                                Servicing
                              </SelectItem>
                              <SelectItem value={ServiceType.Installation}>
                                Installation
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="date">Preferred Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          data-ocid="booking.date.input"
                          value={formData.preferredDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              preferredDate: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="desc">Describe the Issue</Label>
                        <Textarea
                          id="desc"
                          data-ocid="booking.description.textarea"
                          placeholder="Briefly describe the problem (optional)"
                          rows={3}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {createBooking.isError && (
                        <p
                          data-ocid="booking.error_state"
                          className="text-sm text-destructive"
                        >
                          Failed to submit. Please try again or call us
                          directly.
                        </p>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        disabled={createBooking.isPending}
                        data-ocid="booking.submit_button"
                        className="cta-btn border-0 w-full font-bold text-base shadow-orange"
                      >
                        {createBooking.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Booking Request"
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-100 text-brand-600 border-brand-200 text-xs tracking-widest uppercase">
              Customer Reviews
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Hundreds of happy customers trust Appliance Reborn for all their
              appliance needs.
            </p>
          </motion.div>

          {testimonialsLoading ? (
            <div
              data-ocid="testimonials.loading_state"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {displayTestimonials.map((t, i) => (
                <motion.div key={Number(t.id)} variants={fadeUp}>
                  <Card
                    data-ocid={`testimonials.item.${i + 1}`}
                    className="h-full border-border hover:border-brand-500/30 transition-colors"
                  >
                    <CardContent className="p-6">
                      <StarRating rating={Number(t.rating)} />
                      <p className="text-sm text-foreground mt-4 mb-5 leading-relaxed italic">
                        &ldquo;{t.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: "oklch(0.52 0.18 220)" }}
                        >
                          {t.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {t.author}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Verified Customer
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-24"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.05 260) 0%, oklch(0.20 0.08 250) 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-500/20 text-brand-200 border-brand-500/30 text-xs tracking-widest uppercase">
              Get In Touch
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Appliance Reborn
            </h2>
            <p className="text-white/60 max-w-md mx-auto">
              We&apos;re ready to help. Call, WhatsApp, or book online.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              {
                icon: <Phone className="w-6 h-6" />,
                title: "Call / WhatsApp",
                value: PHONE,
                href: `tel:${PHONE}`,
                ocid: "contact.phone.link",
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Service Area",
                value: "City-wide doorstep service",
                href: null,
                ocid: null,
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Working Hours",
                value: "Mon – Sat: 8am – 8pm",
                href: null,
                ocid: null,
              },
            ].map((c) => (
              <motion.div key={c.title} variants={fadeUp}>
                <div
                  className="p-6 rounded-xl text-center"
                  style={{
                    background: "oklch(0.22 0.07 260 / 0.6)",
                    border: "1px solid oklch(0.35 0.08 250 / 0.4)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: "oklch(0.52 0.18 220 / 0.15)",
                      color: "oklch(0.72 0.15 220)",
                    }}
                  >
                    {c.icon}
                  </div>
                  <p className="font-display font-semibold text-white mb-1">
                    {c.title}
                  </p>
                  {c.href ? (
                    <a
                      href={c.href}
                      data-ocid={c.ocid ?? undefined}
                      className="text-brand-300 hover:text-brand-200 font-semibold transition-colors"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-white/60 text-sm">{c.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Button
              size="lg"
              onClick={scrollToBooking}
              data-ocid="contact.primary_button"
              className="cta-btn border-0 text-base font-bold px-10 shadow-orange gap-2"
            >
              Book a Service Now
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-10 border-t"
        style={{
          background: "oklch(0.10 0.04 260)",
          borderColor: "oklch(0.22 0.06 260)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-orange-500 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white">
                Appliance Reborn
              </span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6">
              {["Services", "Booking", "Testimonials", "Contact"].map((s) => (
                <a
                  key={s}
                  href={`#${s.toLowerCase()}`}
                  data-ocid={`footer.${s.toLowerCase()}.link`}
                  className="text-sm text-white/50 hover:text-white/80 transition-colors"
                >
                  {s}
                </a>
              ))}
              <a
                href="/admin"
                data-ocid="footer.admin.link"
                className="text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                Admin
              </a>
            </nav>
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/50 transition-colors"
              >
                Built with ❤️ using caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
