import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Cart Item ─────────────────────────────────────────────────────────────────

export interface CartItem {
  cartId: string;           // unique per cart entry (id + color + size)
  id: number;               // product id
  title: string;
  subtitle: string;
  price: string;
  priceNum: number;
  image: string;
  category: "1-of-1" | "dresses" | "sleepwear" | "lingerie";
  color: string;
  size: string;
  quantity: number;
}

// ─── Store Interface ───────────────────────────────────────────────────────────

interface AppState {
  // Access / lobby flags
  isInvited: boolean;
  inviteCode: string | null;
  hasVisitedLobby: boolean;
  hasLetterBeenRead: boolean;

  // Cart
  cart: CartItem[];
  cartCount: () => number;       // derived — total quantity across all items

  // Access actions
  setInvited: (invited: boolean, code?: string | null) => void;
  setHasVisitedLobby: (visited: boolean) => void;
  setHasLetterBeenRead: (read: boolean) => void;

  // Cart actions
  addToCart: (item: Omit<CartItem, "cartId" | "quantity"> & { quantity?: number }) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Defaults ──
      isInvited: false,
      inviteCode: null,
      hasVisitedLobby: false,
      hasLetterBeenRead: false,
      cart: [],

      // ── Derived ──
      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

      // ── Access actions ──
      setInvited: (invited, code = null) =>
        set({ isInvited: invited, inviteCode: code }),

      setHasVisitedLobby: (visited) =>
        set({ hasVisitedLobby: visited }),

      setHasLetterBeenRead: (read) =>
        set({ hasLetterBeenRead: read }),

      // ── Cart actions ──
      addToCart: (item) => {
        const cartId = `${item.id}-${item.color}-${item.size}`;
        set((state) => {
          const existing = state.cart.find((c) => c.cartId === cartId);
          if (existing) {
            // For 1-of-1 items, never exceed quantity 1
            if (existing.category === "1-of-1") return state;
            return {
              cart: state.cart.map((c) =>
                c.cartId === cartId
                  ? { ...c, quantity: c.quantity + (item.quantity ?? 1) }
                  : c
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              { ...item, cartId, quantity: item.quantity ?? 1 },
            ],
          };
        });
      },

      removeFromCart: (cartId) =>
        set((state) => ({
          cart: state.cart.filter((c) => c.cartId !== cartId),
        })),

      updateQuantity: (cartId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((c) => c.cartId !== cartId)
              : state.cart.map((c) =>
                  c.cartId === cartId
                    ? {
                        ...c,
                        quantity:
                          c.category === "1-of-1" ? 1 : quantity,
                      }
                    : c
                ),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "SHAGHAV-storage",   // localStorage key
      version: 2,               // bump version to flush old cart shape
    }
  )
);
