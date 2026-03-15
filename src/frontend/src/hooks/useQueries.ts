import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApplianceType,
  BookingRequest,
  BookingStatus,
  ServiceType,
  TestimonialStatus,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetApprovedTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["approvedTestimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["pendingTestimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookingCounts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookingCounts"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBookingCounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: BookingRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingCounts"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: { bookingId: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingCounts"] });
    },
  });
}

export function useDeleteBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingCounts"] });
    },
  });
}

export function useSubmitTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      author,
      content,
      rating,
    }: { author: string; content: string; rating: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitTestimonial(author, content, rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvedTestimonials"] });
    },
  });
}

export function useUpdateTestimonialStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: TestimonialStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTestimonialStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingTestimonials"] });
      queryClient.invalidateQueries({ queryKey: ["approvedTestimonials"] });
    },
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteTestimonial(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingTestimonials"] });
      queryClient.invalidateQueries({ queryKey: ["approvedTestimonials"] });
    },
  });
}

export type { BookingRequest, BookingStatus, ApplianceType, ServiceType };
