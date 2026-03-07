import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Material, Room } from "../backend.d";
import { ProductCard } from "../components/ProductCard";
import { useGetProducts } from "../hooks/useQueries";
import { getMaterialLabel, getRoomLabel } from "../utils/helpers";

export function ShopPage() {
  const { data: products, isLoading, isError } = useGetProducts();

  // Read room from URL search params
  const search = useSearch({ strict: false }) as { room?: string };
  const navigate = useNavigate();

  const [selectedRooms, setSelectedRooms] = useState<Set<Room>>(new Set());
  const [selectedMaterials, setSelectedMaterials] = useState<Set<Material>>(
    new Set(),
  );

  // Pre-apply room filter from URL param
  useEffect(() => {
    const roomParam = search.room;
    if (roomParam) {
      const roomValues = Object.values(Room);
      if (roomValues.includes(roomParam as Room)) {
        setSelectedRooms(new Set([roomParam as Room]));
      }
    }
  }, [search.room]);

  const toggleRoom = (room: Room) => {
    setSelectedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(room)) next.delete(room);
      else next.add(room);
      return next;
    });
    // Clear URL room param when toggling manually
    navigate({ to: "/shop", search: {} });
  };

  const toggleMaterial = (material: Material) => {
    setSelectedMaterials((prev) => {
      const next = new Set(prev);
      if (next.has(material)) next.delete(material);
      else next.add(material);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedRooms(new Set());
    setSelectedMaterials(new Set());
    navigate({ to: "/shop", search: {} });
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const roomMatch = selectedRooms.size === 0 || selectedRooms.has(p.room);
      const materialMatch =
        selectedMaterials.size === 0 ||
        p.availableMaterials.some((m) => selectedMaterials.has(m));
      return roomMatch && materialMatch;
    });
  }, [products, selectedRooms, selectedMaterials]);

  const rooms = [
    {
      value: Room.living,
      label: getRoomLabel(Room.living),
      ocid: "filter.room_living.checkbox",
    },
    {
      value: Room.dining,
      label: getRoomLabel(Room.dining),
      ocid: "filter.room_dining.checkbox",
    },
    {
      value: Room.bedroom,
      label: getRoomLabel(Room.bedroom),
      ocid: "filter.room_bedroom.checkbox",
    },
    {
      value: "decor" as Room,
      label: "Decor",
      ocid: "filter.room_decor.checkbox",
    },
  ];

  const materials = [
    {
      value: Material.naturalTeak,
      label: getMaterialLabel(Material.naturalTeak),
      ocid: "filter.material_teak.checkbox",
    },
    {
      value: Material.matteWalnut,
      label: getMaterialLabel(Material.matteWalnut),
      ocid: "filter.material_walnut.checkbox",
    },
    {
      value: Material.charcoalAsh,
      label: getMaterialLabel(Material.charcoalAsh),
      ocid: "filter.material_ash.checkbox",
    },
  ];

  const hasFilters = selectedRooms.size > 0 || selectedMaterials.size > 0;

  return (
    <main className="pt-16">
      {/* Page Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-12 hairline-bottom">
        <p className="text-eyebrow mb-3">All Pieces</p>
        <div className="section-divider">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground whitespace-nowrap px-6">
            The Collection
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          {/* ── Sidebar Filters ─────────────────────────────── */}
          <aside className="w-full md:w-60 shrink-0">
            <div className="md:sticky md:top-24">
              {/* Room filters */}
              <div className="mb-10">
                <p className="text-eyebrow mb-5">Filter by Room</p>
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div key={room.value} className="flex items-center gap-3">
                      <Checkbox
                        id={`room-${room.value}`}
                        data-ocid={room.ocid}
                        checked={selectedRooms.has(room.value)}
                        onCheckedChange={() => toggleRoom(room.value)}
                        className="border-stone rounded-none"
                      />
                      <Label
                        htmlFor={`room-${room.value}`}
                        className="text-sm font-sans text-foreground cursor-pointer"
                      >
                        {room.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hairline-bottom mb-10" />

              {/* Material filters */}
              <div className="mb-10">
                <p className="text-eyebrow mb-5">Filter by Material</p>
                <div className="space-y-3">
                  {materials.map((mat) => (
                    <div key={mat.value} className="flex items-center gap-3">
                      <Checkbox
                        id={`material-${mat.value}`}
                        data-ocid={mat.ocid}
                        checked={selectedMaterials.has(mat.value)}
                        onCheckedChange={() => toggleMaterial(mat.value)}
                        className="border-stone rounded-none"
                      />
                      <Label
                        htmlFor={`material-${mat.value}`}
                        className="text-sm font-sans text-foreground cursor-pointer"
                      >
                        {mat.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <button
                  type="button"
                  data-ocid="filter.clear_button"
                  onClick={clearFilters}
                  className="text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors duration-200 underline underline-offset-4"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* ── Product Grid ──────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Loading */}
            {isLoading && (
              <div
                data-ocid="shop.loading_state"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((sk) => (
                  <div key={sk}>
                    <Skeleton className="aspect-square bg-stone" />
                    <Skeleton className="h-3 w-16 mt-4 bg-stone" />
                    <Skeleton className="h-5 w-48 mt-2 bg-stone" />
                    <Skeleton className="h-4 w-24 mt-2 bg-stone" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div data-ocid="shop.error_state" className="py-20 text-center">
                <p className="text-sm font-sans text-muted-foreground">
                  Unable to load products. Please refresh.
                </p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && filteredProducts.length === 0 && (
              <div data-ocid="shop.empty_state" className="py-24 text-center">
                <p className="font-serif text-2xl text-foreground mb-3">
                  No pieces found
                </p>
                <p className="text-sm font-sans text-muted-foreground mb-8">
                  Try adjusting your filters to explore more of the collection.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs tracking-[0.15em] uppercase font-sans text-foreground border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Products */}
            {!isLoading && !isError && filteredProducts.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground font-sans mb-8 tracking-wide">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "piece" : "pieces"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                  {filteredProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      ocid={i < 3 ? `shop.product.item.${i + 1}` : undefined}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
