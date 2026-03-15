import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Loader2,
  LogIn,
  LogOut,
  MessageSquare,
  Phone,
  Shield,
  Trash2,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { BookingStatus, TestimonialStatus } from "../backend.d";
import type { Booking, Testimonial } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteBooking,
  useDeleteTestimonial,
  useGetBookingCounts,
  useGetBookings,
  useGetPendingTestimonials,
  useIsCallerAdmin,
  useUpdateBookingStatus,
  useUpdateTestimonialStatus,
} from "../hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const APPLIANCE_LABELS: Record<string, string> = {
  WashingMachine: "Washing Machine",
  Dryer: "Dryer",
  Dishwasher: "Dishwasher",
  Microwave: "Microwave",
  Chimney: "Chimney",
  HobChula: "Hob / Chula",
};

function BookingsTable() {
  const { data: bookings, isLoading } = useGetBookings();
  const updateStatus = useUpdateBookingStatus();
  const deleteBooking = useDeleteBooking();

  if (isLoading) {
    return (
      <div data-ocid="admin.bookings.loading_state" className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div
        data-ocid="admin.bookings.empty_state"
        className="text-center py-16 text-muted-foreground"
      >
        <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table data-ocid="admin.bookings.table">
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Appliance</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking: Booking, i: number) => (
            <TableRow
              key={String(booking.id)}
              data-ocid={`admin.bookings.row.${i + 1}`}
            >
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{booking.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {booking.phone}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {APPLIANCE_LABELS[booking.applianceType] ??
                  booking.applianceType}
              </TableCell>
              <TableCell className="text-sm">{booking.serviceType}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {booking.preferredDate}
              </TableCell>
              <TableCell>
                <Select
                  value={booking.status}
                  onValueChange={async (v) => {
                    try {
                      await updateStatus.mutateAsync({
                        bookingId: booking.id,
                        status: v as BookingStatus,
                      });
                      toast.success("Status updated");
                    } catch {
                      toast.error("Failed to update status");
                    }
                  }}
                >
                  <SelectTrigger
                    data-ocid={`admin.bookings.status.select.${i + 1}`}
                    className={`w-32 h-8 text-xs border ${
                      STATUS_COLORS[booking.status] ?? ""
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BookingStatus).map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      data-ocid={`admin.bookings.delete_button.${i + 1}`}
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent data-ocid="admin.bookings.dialog">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The booking for{" "}
                        <span className="font-semibold">{booking.name}</span>{" "}
                        will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="admin.bookings.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        data-ocid="admin.bookings.confirm_button"
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={async () => {
                          try {
                            await deleteBooking.mutateAsync(booking.id);
                            toast.success("Booking deleted");
                          } catch {
                            toast.error("Failed to delete booking");
                          }
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TestimonialsPanel() {
  const { data: testimonials, isLoading } = useGetPendingTestimonials();
  const updateStatus = useUpdateTestimonialStatus();
  const deleteTestimonial = useDeleteTestimonial();

  if (isLoading) {
    return (
      <div data-ocid="admin.testimonials.loading_state" className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div
        data-ocid="admin.testimonials.empty_state"
        className="text-center py-16 text-muted-foreground"
      >
        <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No pending testimonials</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {testimonials.map((t: Testimonial, i: number) => (
        <Card
          key={String(t.id)}
          data-ocid={`admin.testimonials.item.${i + 1}`}
          className="border-border"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">{t.author}</span>
                  <Badge variant="outline" className="text-xs">
                    {Number(t.rating)}★
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  data-ocid={`admin.testimonials.confirm_button.${i + 1}`}
                  className="h-8 gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs"
                  onClick={async () => {
                    try {
                      await updateStatus.mutateAsync({
                        id: t.id,
                        status: TestimonialStatus.approved,
                      });
                      toast.success("Testimonial approved");
                    } catch {
                      toast.error("Failed to approve");
                    }
                  }}
                  disabled={updateStatus.isPending}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`admin.testimonials.delete_button.${i + 1}`}
                  className="h-8 gap-1.5 text-destructive hover:text-destructive text-xs border-destructive/30"
                  onClick={async () => {
                    try {
                      await updateStatus.mutateAsync({
                        id: t.id,
                        status: TestimonialStatus.rejected,
                      });
                      toast.success("Testimonial rejected");
                    } catch {
                      toast.error("Failed to reject");
                    }
                  }}
                  disabled={updateStatus.isPending}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent data-ocid="admin.testimonials.dialog">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Permanently delete this testimonial from {t.author}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="admin.testimonials.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        data-ocid="admin.testimonials.confirm_button"
                        className="bg-destructive text-destructive-foreground"
                        onClick={async () => {
                          try {
                            await deleteTestimonial.mutateAsync(t.id);
                            toast.success("Deleted");
                          } catch {
                            toast.error("Failed to delete");
                          }
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: counts, isLoading: countsLoading } = useGetBookingCounts();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  if (isInitializing || adminLoading) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.14 0.05 260)" }}
      >
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-brand-400" />
          <p className="text-white/60">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.06 260) 0%, oklch(0.20 0.08 250) 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-sm" data-ocid="admin.login.card">
            <CardContent className="p-8 text-center">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: "oklch(0.52 0.18 220 / 0.1)",
                  border: "1px solid oklch(0.52 0.18 220 / 0.3)",
                }}
              >
                <Shield
                  className="w-8 h-8"
                  style={{ color: "oklch(0.52 0.18 220)" }}
                />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Appliance Reborn — manage bookings &amp; testimonials
              </p>
              <Button
                className="w-full gap-2"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="admin.login.primary_button"
                style={{ background: "oklch(0.52 0.18 220)" }}
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isLoggingIn ? "Logging in..." : "Login with Internet Identity"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.06 260) 0%, oklch(0.20 0.08 250) 100%)",
        }}
      >
        <Card className="w-full max-w-sm" data-ocid="admin.unauthorized.card">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Access Denied
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              You don&apos;t have admin access to this panel.
            </p>
            <Button
              variant="outline"
              onClick={clear}
              data-ocid="admin.unauthorized.secondary_button"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header
        className="border-b border-border"
        style={{ background: "oklch(0.14 0.05 260)" }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-orange-500 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">
                Appliance Reborn
              </span>
              <span
                className="ml-2 text-xs px-2 py-0.5 rounded"
                style={{
                  background: "oklch(0.52 0.18 220 / 0.2)",
                  color: "oklch(0.72 0.14 220)",
                }}
              >
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-white/50" />
              <span className="text-xs text-white/50 hidden sm:block">
                {identity?.getPrincipal().toString().slice(0, 12)}...
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={clear}
              data-ocid="admin.logout.button"
              className="text-white/60 hover:text-white gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {countsLoading
              ? [1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))
              : [
                  {
                    label: "Pending",
                    value: counts?.pending ?? 0n,
                    color: "text-yellow-600",
                    bg: "bg-yellow-50",
                    icon: <Calendar className="w-5 h-5" />,
                    ocid: "admin.stats.pending.card",
                  },
                  {
                    label: "Confirmed",
                    value: counts?.confirmed ?? 0n,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    icon: <CheckCircle className="w-5 h-5" />,
                    ocid: "admin.stats.confirmed.card",
                  },
                  {
                    label: "Completed",
                    value: counts?.completed ?? 0n,
                    color: "text-green-600",
                    bg: "bg-green-50",
                    icon: <CheckCircle className="w-5 h-5" />,
                    ocid: "admin.stats.completed.card",
                  },
                  {
                    label: "Cancelled",
                    value: counts?.cancelled ?? 0n,
                    color: "text-red-600",
                    bg: "bg-red-50",
                    icon: <XCircle className="w-5 h-5" />,
                    ocid: "admin.stats.cancelled.card",
                  },
                ].map((stat) => (
                  <Card key={stat.label} data-ocid={stat.ocid}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground font-medium">
                          {stat.label}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}
                        >
                          {stat.icon}
                        </div>
                      </div>
                      <p
                        className={`font-display text-3xl font-bold ${stat.color}`}
                      >
                        {String(stat.value)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings">
            <TabsList className="mb-6" data-ocid="admin.tabs.tab">
              <TabsTrigger
                value="bookings"
                data-ocid="admin.bookings.tab"
                className="gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger
                value="testimonials"
                data-ocid="admin.testimonials.tab"
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Testimonials
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    All Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingsTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    Pending Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TestimonialsPanel />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
