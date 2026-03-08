import { useMutation, useQuery } from "@tanstack/react-query";
import type { Product, ShowroomLead } from "../backend.d";
import { useActor } from "./useActor";

function getAdminProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem("we_admin_products") ?? "[]").map(
      (p: Product & { priceInr: string | bigint }) => ({
        ...p,
        priceInr: BigInt(p.priceInr),
      }),
    );
  } catch {
    return [];
  }
}

function getDeletedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem("we_admin_deleted") ?? "[]");
  } catch {
    return [];
  }
}

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const deletedIds = getDeletedIds();
      const adminProducts = getAdminProducts();
      if (!actor)
        return adminProducts.filter((p) => !deletedIds.includes(p.id));
      const backendProducts = await actor.getProducts();
      const merged = [
        ...backendProducts.filter((p) => !deletedIds.includes(p.id)),
        ...adminProducts.filter(
          (ap) =>
            !deletedIds.includes(ap.id) &&
            !backendProducts.find((bp) => bp.id === ap.id),
        ),
      ];
      return merged;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNewArrivals() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["newArrivals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNewArrivals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductById(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetMostLoved(limit: number) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["mostLoved", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMostLoved(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordView() {
  const { actor } = useActor();
  return useMutation<void, Error, { productId: string }>({
    mutationFn: async ({ productId }) => {
      if (!actor) return;
      return actor.recordView(productId);
    },
  });
}

export function useSubmitShowroomLead() {
  const { actor } = useActor();
  return useMutation<
    string,
    Error,
    {
      name: string;
      email: string;
      phone: string;
      pincode: string;
      message: string;
    }
  >({
    mutationFn: async ({ name, email, phone, pincode, message }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitShowroomLead(name, email, phone, pincode, message);
    },
  });
}

export function useGetShowroomLeads() {
  const { actor, isFetching } = useActor();
  return useQuery<ShowroomLead[]>({
    queryKey: ["showroomLeads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getShowroomLeads();
    },
    enabled: !!actor && !isFetching,
  });
}
