"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  ShoppingCart,
  Trash2,
  Pill,
  FileText,
  Download,
  Receipt,
  Sparkles,
} from "lucide-react";
import api from "@/lib/api";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

type Product = {
  id: number;
  name: string;
  description?: string;
  image?: string | null;
  price?: number;
  discount?: number;
  stock_count?: number;
  category?: { id: number; name: string } | null;
};

export default function PharmacistMedicinePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Array<{ product: Product; qty: number }>>(
    []
  );
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [prescriptionDraft, setPrescriptionDraft] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Mapping modal state for prescription draft
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [mappingItems, setMappingItems] = useState<Array<any>>([]);
  const [mappingSearch, setMappingSearch] = useState("");
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Apply draft from prescriptions page if present — prepare mapping choices
  useEffect(() => {
    const applyDraft = async () => {
      try {
        const raw = localStorage.getItem("draftPrescriptionSale");
        if (!raw) return;
        const draft = JSON.parse(raw);
        if (draft.patient_name) setCustomerName(draft.patient_name);
        if (draft.phone) setPhone(draft.phone);

        const meds = Array.isArray(draft.medications) ? draft.medications : [];
        if (meds.length === 0) {
          localStorage.removeItem("draftPrescriptionSale");
          return;
        }

        const token = localStorage.getItem("token");
        const res = await fetch(api(`/api/pharmacy/products/`), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          localStorage.removeItem("draftPrescriptionSale");
          Swal.fire({
            icon: "error",
            title: "Unable to load products",
            text: "Unable to load products for mapping. Open billing and add items manually.",
          });
          return;
        }
        const data = await res.json().catch(() => ({}));
        const prodList: Product[] = data.medicines || data.products || [];
        setProducts(prodList);

        const items = meds.map((m: any) => {
          const name = (m.name || "").toString().trim();
          const lower = name.toLowerCase();
          const candidates = prodList
            .filter((p) =>
              (p.name || "").toString().toLowerCase().includes(lower)
            )
            .slice(0, 50);
          return {
            name,
            dosage: m.dosage || "",
            duration: m.duration || "",
            selectedProductId:
              candidates.length === 1 ? candidates[0].id : undefined,
            qty: 1,
            candidates,
          } as any;
        });

        setMappingItems(items);
        setShowMappingModal(true);
      } catch (e) {
        console.error("Error applying prescription draft", e);
      }
    };

    applyDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProducts();

    // Check for prescription draft
    const draft = localStorage.getItem("draftPrescriptionSale");
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setPrescriptionDraft(parsedDraft);
        if (parsedDraft.patient_name) setCustomerName(parsedDraft.patient_name);
        if (parsedDraft.phone) setPhone(parsedDraft.phone);
      } catch (e) {
        console.error("Error parsing prescription draft", e);
      }
    }
  }, []);

  const updateMappingSelection = (
    index: number,
    productId: number | undefined,
    qty?: number
  ) => {
    setMappingItems((items) => {
      const copy = [...items];
      copy[index] = {
        ...copy[index],
        selectedProductId: productId,
        qty: qty ?? copy[index].qty,
      };
      return copy;
    });
  };

  const applyMappingToCart = () => {
    const toAdd: Array<{ product: Product; qty: number }> = [];
    const unmatched: string[] = [];
    mappingItems.forEach((mi) => {
      if (mi.selectedProductId) {
        const prod = products.find((p) => p.id === mi.selectedProductId);
        if (prod) toAdd.push({ product: prod, qty: mi.qty || 1 });
      } else {
        unmatched.push(mi.name || "(unknown)");
      }
    });

    if (toAdd.length > 0) {
      setCart((c) => {
        const copy = [...c];
        toAdd.forEach((it) => {
          const existing = copy.find((x) => x.product.id === it.product.id);
          if (existing)
            existing.qty = Math.min(
              existing.qty + it.qty,
              it.product.stock_count || 9999
            );
          else copy.push(it);
        });
        return copy;
      });
    }

    localStorage.removeItem("draftPrescriptionSale");
    setShowMappingModal(false);
    setMappingItems([]);
    if (unmatched.length > 0)
      Swal.fire({
        icon: "warning",
        title: "Unmapped medications",
        text: unmatched.join(", "),
      });
  };

  const cancelMapping = () => {
    localStorage.removeItem("draftPrescriptionSale");
    setShowMappingModal(false);
    setMappingItems([]);
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api(`/api/pharmacy/products/`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setProducts(data.medicines || data.products || []);
    } catch (e) {
      console.error("fetch products", e);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart((c) => {
      const found = c.find((x) => x.product.id === product.id);
      if (found) {
        return c.map((x) =>
          x.product.id === product.id
            ? {
                ...x,
                qty: Math.min((x.qty || 0) + 1, product.stock_count || 9999),
              }
            : x
        );
      }
      return [...c, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((c) => c.filter((x) => x.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    setCart((c) =>
      c.map((x) => (x.product.id === productId ? { ...x, qty } : x))
    );
  };

  const handleQtyChange = (productId: number, value: string) => {
    // Allow empty value for better UX
    if (value === "") {
      setCart((c) =>
        c.map((x) => (x.product.id === productId ? { ...x, qty: 0 } : x))
      );
      return;
    }

    // Parse the number and ensure it's valid
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1) {
      setCart((c) =>
        c.map((x) => (x.product.id === productId ? { ...x, qty: numValue } : x))
      );
    }
  };

  const handleBlur = (productId: number, currentQty: number) => {
    // If quantity is 0 or invalid after blur, set it back to 1
    if (!currentQty || currentQty < 1) {
      setCart((c) =>
        c.map((x) => (x.product.id === productId ? { ...x, qty: 1 } : x))
      );
    }
  };

  const subtotal = cart.reduce((s, item) => {
    const price = Number(item.product.price) || 0;
    const discount = Number((item.product as any).discount) || 0;
    const discounted = price * (1 - (discount || 0) / 100);
    return s + discounted * item.qty;
  }, 0);
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const printBill = () => {
    const billContent = `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 2px solid #1656a4; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #1656a4, #06b6d4); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-weight: bold; font-size: 16px;">Rx</span>
            </div>
            <h1 style="color: #1656a4; margin: 0; font-size: 24px; font-weight: bold;">Arogya Pharmacy</h1>
          </div>
          <p style="color: #666; margin: 0; font-size: 12px;">Professional Pharmaceutical Services</p>
        </div>
        
        <div style="border-bottom: 2px dashed #e5e7eb; padding-bottom: 15px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Customer:</span>
            <span>${customerName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Phone:</span>
            <span>${phone}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: bold;">Payment:</span>
            <span style="text-transform: uppercase;">${paymentMethod}</span>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          ${cart
            .map((item) => {
              const price = Number(item.product.price) || 0;
              const discount = Number((item.product as any).discount) || 0;
              const discounted = price * (1 - (discount || 0) / 100);
              return `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f3f4f6;">
                <div>
                  <div style="font-weight: 500;">${item.product.name}</div>
                  <div style="font-size: 12px; color: #666;">${
                    item.qty
                  } x Rs. ${discounted.toFixed(2)}</div>
                </div>
                <div style="font-weight: bold;">Rs. ${(
                  discounted * item.qty
                ).toFixed(2)}</div>
              </div>
            `;
            })
            .join("")}
        </div>

        <div style="border-top: 2px dashed #e5e7eb; padding-top: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span>Rs. ${subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Tax (5%):</span>
            <span>Rs. ${tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #1656a4; margin-top: 10px;">
            <span>TOTAL:</span>
            <span>Rs. ${total.toFixed(2)}</span>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px dashed #e5e7eb;">
          <p style="color: #666; font-size: 11px; margin: 0;">
            Thank you for choosing Arogya Pharmacy<br>
            Contact: +94 112 345 678 | www.arogyapharmacy.lk
          </p>
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bill - Arogya Pharmacy</title>
            <style>
              body { margin: 20px; font-family: Arial, sans-serif; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>${billContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const completeBilling = async () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Cart is empty",
        text: "Add products to the cart before billing.",
        background: "#f8fafc",
        color: "#1e293b",
      });
      return;
    }
    if (!customerName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Customer name required",
        text: "Please enter the customer name.",
        background: "#f8fafc",
        color: "#1e293b",
      });
      return;
    }

    setIsProcessing(true);

    const payload = {
      customer_name: customerName,
      phone,
      payment_method: paymentMethod,
      items: cart.map((c) => ({ product_id: c.product.id, qty: c.qty })),
    };

    try {
      const token = localStorage.getItem("token");

      // Step 1: Create the sale
      const res = await fetch(api(`/api/pharmacy/sales/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        const saleId = data.sale?.id;

        // Step 2: If this was from a prescription, mark it as dispensed
        if (prescriptionDraft && prescriptionDraft.prescription_id) {
          try {
            const dispenseRes = await fetch(
              api(
                `/api/appointment/prescriptions/${prescriptionDraft.prescription_id}/dispense/`
              ),
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  dispensed: true,
                  sale_id: saleId || null,
                }),
              }
            );

            const dispenseData = await dispenseRes.json().catch(() => ({}));

            if (dispenseRes.ok && dispenseData.success) {
              console.log("Prescription marked as dispensed");
            } else {
              console.warn(
                "Failed to mark prescription as dispensed:",
                dispenseData
              );
            }
          } catch (dispenseError) {
            console.error(
              "Error marking prescription as dispensed:",
              dispenseError
            );
          }
        }

        // Step 3: Show success message and options
        await Swal.fire({
          icon: "success",
          title: "Billing Completed Successfully!",
          text: `Sale ID: ${saleId || "N/A"}`,
          background: "#f0fdf4",
          color: "#166534",
          showCancelButton: true,
          confirmButtonText: "Print Bill",
          cancelButtonText: prescriptionDraft
            ? "Back to Prescriptions"
            : "Continue",
          confirmButtonColor: "#1656a4",
          cancelButtonColor: "#6b7280",
        }).then((result) => {
          if (result.isConfirmed) {
            printBill();
          }

          // Redirect to prescriptions page if this was from a prescription
          if (prescriptionDraft) {
            setTimeout(() => {
              window.location.href = "/pharmacist/prescriptions";
            }, 500);
          }
        });

        // Step 4: Reset form and clear draft
        setCart([]);
        setCustomerName("");
        setPhone("");
        setPrescriptionDraft(null);
        localStorage.removeItem("draftPrescriptionSale");

        // Refresh products to reflect updated stock
        fetchProducts();
      } else {
        Swal.fire({
          icon: "error",
          title: "Billing Failed",
          text: data.message || "Please try again",
          background: "#fef2f2",
          color: "#dc2626",
        });
      }
    } catch (e) {
      console.error("Billing error", e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while completing billing",
        background: "#fef2f2",
        color: "#dc2626",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
              Pharmacy Sales
            </h1>
            <p className="text-gray-600">Manage medicine sales and billing</p>
          </div>
        </div>
      </div>

      {showMappingModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={cancelMapping}
          />
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-1/3 bg-white shadow-2xl overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex-1 pr-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Map Prescription Items
                </h3>
                <Input
                  placeholder="Search products (related items shown first)..."
                  value={mappingSearch}
                  onChange={(e) => setMappingSearch(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex flex-col items-end gap-2">
                <label className="text-xs text-gray-600">Show all</label>
                <input
                  type="checkbox"
                  checked={showAllProducts}
                  onChange={(e) => setShowAllProducts(e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            </div>

            <div className="p-4">
              {mappingItems.map((mi, idx) => {
                const searchLower = mappingSearch.toLowerCase().trim();
                const miLower = (mi.name || "").toLowerCase();

                const matches = products.filter((p) => {
                  const n = (p.name || "").toLowerCase();
                  if (searchLower && n.includes(searchLower)) return true;
                  if (!searchLower && miLower && n.includes(miLower))
                    return true;
                  return false;
                });

                const others = showAllProducts
                  ? products.filter((p) => !matches.some((m) => m.id === p.id))
                  : [];
                const options = [...matches, ...others].slice(0, 500);

                return (
                  <div
                    key={idx}
                    className="border rounded p-3 mb-3 grid grid-cols-1 gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{mi.name}</div>
                        <div className="text-xs text-gray-500">{mi.dosage}</div>
                      </div>
                      <div className="text-xs text-gray-500">Qty</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={mi.selectedProductId ?? ""}
                        onChange={(e) =>
                          updateMappingSelection(
                            idx,
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="flex-1 border rounded px-2 py-2"
                      >
                        <option value="">
                          -- choose a product (or leave blank) --
                        </option>
                        {options.length > 0 ? (
                          options.map((c: Product) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                              {c.stock_count
                                ? ` — ${c.stock_count} in stock`
                                : ""}
                            </option>
                          ))
                        ) : (
                          <option disabled>No matching products</option>
                        )}
                      </select>

                      <input
                        type="number"
                        min={1}
                        value={mi.qty}
                        onChange={(e) =>
                          updateMappingSelection(
                            idx,
                            mi.selectedProductId,
                            Math.max(1, Number(e.target.value))
                          )
                        }
                        className="w-20 border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-between mt-4">
                <div />
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={cancelMapping}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={applyMappingToCart}
                    className="bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90"
                  >
                    Apply to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search medicines..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
                />
                <Badge variant="secondary" className="px-3 py-2">
                  {filtered.length} products
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {filtered.map((p) => (
              <Card
                key={p.id}
                className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-4">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg overflow-hidden flex items-center justify-center mb-3 border">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-full flex items-center justify-center text-white">
                        <Pill className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {p.description || "Pharmaceutical product"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {(p.discount || 0) > 0 ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs line-through text-gray-400">
                              Rs. {(Number(p.price) || 0).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-900 font-bold">
                              Rs.{" "}
                              {(
                                (Number(p.price) || 0) *
                                (1 - (Number(p.discount) || 0) / 100)
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span>Rs. {(Number(p.price) || 0).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      className={`${
                        (p.stock_count ?? 0) === 0
                          ? "bg-red-100 text-red-800"
                          : (p.stock_count ?? 0) <= 10
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {(p.stock_count ?? 0) === 0
                        ? "Out of stock"
                        : `${p.stock_count ?? 0} in stock`}
                    </Badge>

                    <Button
                      size="sm"
                      onClick={() => addToCart(p)}
                      disabled={(p.stock_count ?? 0) === 0}
                      className="bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing Section */}
        <div className="lg:col-span-1">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl sticky top-6">
            <CardHeader className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Billing Cart
                </span>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {cart.reduce((s, i) => s + i.qty, 0)} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Cart Items */}
              <div className="space-y-3 max-h-[280px] overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Cart is empty</p>
                    <p className="text-xs mt-1">
                      Add products to start billing
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {item.product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Pill className="w-4 h-4 text-[#1656a4]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Rs. {(Number(item.product.price) || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={item.qty === 0 ? "" : item.qty}
                          onChange={(e) =>
                            handleQtyChange(item.product.id, e.target.value)
                          }
                          onBlur={() => handleBlur(item.product.id, item.qty)}
                          className="w-14 text-sm border rounded px-2 py-1 text-center"
                          placeholder="1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Customer Information
                  </label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name *"
                    className="mb-3 border-2 border-gray-200 focus:border-[#1656a4]"
                    disabled={false}
                    autoFocus={true}
                  />
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="border-2 border-gray-200 focus:border-[#1656a4]"
                    disabled={false}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Payment Method
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                        paymentMethod === "cash"
                          ? "border-[#1656a4] bg-blue-50 text-[#1656a4] font-semibold"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      💵 Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                        paymentMethod === "card"
                          ? "border-[#1656a4] bg-blue-50 text-[#1656a4] font-semibold"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      💳 Card
                    </button>
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        Rs. {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (5%):</span>
                      <span className="font-medium">Rs. {tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold text-[#1656a4]">
                        <span>Total Amount:</span>
                        <span>Rs. {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={completeBilling}
                    disabled={
                      cart.length === 0 || !customerName.trim() || isProcessing
                    }
                    className="w-full bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-white py-3 text-lg font-semibold shadow-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      `Complete Billing - Rs. ${total.toFixed(2)}`
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={printBill}
                      disabled={cart.length === 0}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Print Preview
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setCart([]);
                        setCustomerName("");
                        setPhone("");
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
