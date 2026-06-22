"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Product, AvailabilityFilter, StockType } from "@/lib/types";
import { computeStatus } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [stockType, setStockType] = useState<StockType>("all");

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_sizes(*)")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data as unknown as Product[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();

    // Suscripción en tiempo real: cualquier cambio en productos o tallas
    // vuelve a traer la lista completa (simple y siempre consistente).
    const channel = supabase
      .channel("catalogo-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "product_sizes" }, () => {
        fetchProducts();
      })
      .subscribe((status) => {
        setIsLive(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  const teams = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.team && set.add(p.team));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const status = computeStatus(p);

      if (search) {
        const q = search.toLowerCase();
        const haystack = `${p.name} ${p.team ?? ""} ${p.category ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (selectedSize) {
        const hasSize = (p.product_sizes ?? []).some(
          (v) => v.size === selectedSize && v.stock_available + v.stock_incoming > 0
        );
        if (!hasSize) return false;
      }

      if (selectedTeam && p.team !== selectedTeam) return false;

      if (availability !== "all") {
        if (availability === "available") {
          // "Disponible" agrupa available + low_stock — la tarjeta seguirá
          // mostrando "Últimas unidades" en el badge cuando aplique.
          if (status !== "available" && status !== "low_stock") return false;
        } else if (availability === "incoming") {
          if (status !== "incoming") return false;
        } else if (availability === "on_sale") {
          if (!p.on_sale) return false;
        }
      }

      if (stockType === "stock") {
        const hasStock = (p.product_sizes ?? []).some((v) => v.stock_available > 0);
        if (!hasStock) return false;
      }
      if (stockType === "incoming") {
        const hasIncoming = (p.product_sizes ?? []).some((v) => v.stock_incoming > 0);
        if (!hasIncoming) return false;
      }

      return true;
    });
  }, [products, search, selectedSize, selectedTeam, availability, stockType]);

  const totals = useMemo(() => {
    let totalAvailable = 0;
    let totalIncoming = 0;
    products.forEach((p) =>
      (p.product_sizes ?? []).forEach((v) => {
        totalAvailable += v.stock_available;
        totalIncoming += v.stock_incoming;
      })
    );
    return { totalAvailable, totalIncoming };
  }, [products]);

  function clearFilters() {
    setSearch("");
    setSelectedSize(null);
    setSelectedTeam("");
    setAvailability("all");
