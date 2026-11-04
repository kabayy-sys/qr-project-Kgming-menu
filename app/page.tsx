'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, Product, WA_NUMBER } from './data';

const CATS = [
  { id: 'mk', name: 'Makanan' },
  { id: 'mn', name: 'Minuman' },
  { id: 'sn', name: 'Snack' }
];

const VALID_TABLES = ['REG-1', 'REG-2', 'REG-3', 'REG-4', 'REG-5', 'VIP-1A', 'VIP-1B', 'VIP-2'];

export default function CustomerMenu() {
  const [tableId, setTableId] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<'mk' | 'mn' | 'sn'>('mk');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [note, setNote] = useState('');
  const [flashMsg, setFlashMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const sig = params.get('sig');

    if (table) {
      const upperTable = table.toUpperCase();
      if (VALID_TABLES.includes(upperTable) || sig === 'kgamingsecure2026') {
        setTableId(upperTable);
      } else {
        setTableId('INVALID');
      }
    } else {
      // Default fallback jika dibuka tanpa param (biar tidak 404/blank)
      setTableId('REG-1');
    }
  }, []);

  if (tableId === 'INVALID') {
    return (
      <div className="max-w-[480px] mx-auto min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full grid place-items-center text-3xl mb-4 font-bricolage">
          ⚠️
        </div>
        <h1 className="font-bricolage font-extrabold text-2xl mb-2">Akses Ditolak</h1>
        <p className="text-[var(--muted)] text-sm mb-6 max-w-xs">
          Silakan lakukan scan QR Code resmi yang tersedia di meja rental K Gaming untuk membuka menu pemesanan.
        </p>
        <div className="text-xs text-[var(--sold)] font-mono">K Gaming Security Protocol</div>
      </div>
    );
  }

  const activeTableDisplay = tableId || 'REG-1';

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[id];
      } else {
        updated[id] = next;
      }
      return updated;
    });

    if (delta > 0) {
      const prod = products.find(p => p.id === id);
      if (prod) {
        setFlashMsg(`+ ${prod.name}`);
        setTimeout(() => setFlashMsg(''), 1800);
      }
    }
  };

  const filteredProducts = products
    .filter(p => p.cat === activeCat)
    .sort((a, b) => b.sold - a.sold);

  const formatRp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  const handleCheckout = () => {
    const lines = products
      .filter(p => cart[p.id])
      .map(p => `- ${cart[p.id]}x ${p.name}`)
      .join('\n');

    const msg = `*PESANAN BARU - ${activeTableDisplay.replace('-', ' ')}*\n${lines}\n${note ? 'Catatan: ' + note + '\n' : ''}Total: ${formatRp(totalPrice)}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-[480px] mx-auto pb-32 min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Header with Logo Brand */}
      <section className="px-5 pt-5 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 grid place-items-center text-white font-extrabold text-sm font-bricolage shadow-md">
              K
            </div>
            <span className="font-extrabold text-lg tracking-tight font-bricolage">K GAMING</span>
          </div>
          <div className="text-sm font-semibold text-[var(--muted)] bg-[var(--surface)] px-3 py-1 rounded-full border border-[var(--line)] shadow-sm" id="tbl">
            {activeTableDisplay.replace('-', ' ')}
          </div>
        </div>
        <h1 className="font-extrabold text-[34px] leading-tight tracking-tight font-bricolage mt-9">
          Mau pesan apa?
        </h1>
      </section>

      {/* Tabs */}
      <nav className="sticky top-0 z-10 flex gap-6 px-5 pt-3 bg-[var(--bg)] border-b border-[var(--line)]">
        {CATS.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id as any)}
            className={`relative pb-3.5 font-semibold text-sm transition-colors ${
              activeCat === c.id ? 'text-[var(--ink)]' : 'text-[var(--muted)]'
            }`}
          >
            {c.name}
            {activeCat === c.id && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--blue)] rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Product List */}
      <main className="px-5 py-2">
        {filteredProducts.map(p => {
          const qty = cart[p.id] || 0;
          return (
            <article
              key={p.id}
              className={`grid grid-cols-[68px_1fr_auto] gap-4 items-center py-3.5 border-b border-[var(--line)] ${
                !p.ok ? 'opacity-40' : ''
              }`}
            >
              <div
                className="w-[68px] h-[68px] rounded-[20px] grid place-items-center text-3xl shadow-sm"
                style={{ backgroundColor: p.tint }}
              >
                {p.emoji}
              </div>
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-[var(--muted)] text-sm mt-0.5">{formatRp(p.price)}</div>
              </div>
              {p.ok ? (
                <div
                  className={`flex items-center rounded-full transition-all duration-300 ${
                    qty > 0 ? 'bg-[var(--blue)] text-[var(--on-blue)]' : 'bg-[var(--ink)] text-[var(--bg)]'
                  }`}
                >
                  {qty > 0 && (
                    <button
                      onClick={() => updateCart(p.id, -1)}
                      className="w-9 h-9 grid place-items-center font-bold text-lg"
                    >
                      −
                    </button>
                  )}
                  <button
                    onClick={() => updateCart(p.id, 1)}
                    className="w-9 h-9 grid place-items-center font-bold text-lg"
                  >
                    {qty > 0 ? qty : '+'}
                  </button>
                </div>
              ) : (
                <span className="text-sm font-medium text-[var(--sold)]">Habis</span>
              )}
            </article>
          );
        })}
      </main>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed left-0 right-0 bottom-0 z-20 px-4 pb-6 pointer-events-none">
          <button
            onClick={() => setIsSheetOpen(true)}
            className="pointer-events-auto flex items-center justify-between w-full max-w-[380px] h-14 mx-auto px-5 bg-[var(--ink)] text-[var(--bg)] rounded-full shadow-2xl transition-transform active:scale-95"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold bg-[var(--blue)] text-white text-xs px-2.5 py-1 rounded-full">
                {totalItems} item
              </span>
              <span className="text-sm font-medium truncate">{flashMsg || 'Lihat Keranjang'}</span>
            </div>
            <span className="font-bold font-bricolage">{formatRp(totalPrice)}</span>
          </button>
        </div>
      )}

      {/* Cart Sheet Modal */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSheetOpen(false)}
          />
          <div className="relative w-full max-w-[480px] bg-[var(--surface)] rounded-t-[28px] p-6 pb-8 z-40 max-h-[85vh] flex flex-col">
            <div className="w-9 h-1 bg-[var(--line)] rounded-full mx-auto mb-4" />
            <h2 className="font-bricolage font-bold text-2xl mb-4">Pesananmu</h2>

            <div className="overflow-y-auto flex-1 divide-y divide-[var(--line)]">
              {products
                .filter(p => cart[p.id])
                .map(p => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-[var(--muted)]">{formatRp(p.price * cart[p.id])}</div>
                    </div>
                    <div className="flex items-center bg-[var(--bg)] rounded-full">
                      <button
                        onClick={() => updateCart(p.id, -1)}
                        className="w-8 h-8 grid place-items-center font-bold"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-bold text-sm">{cart[p.id]}</span>
                      <button
                        onClick={() => updateCart(p.id, 1)}
                        className="w-8 h-8 grid place-items-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Catatan pesanan (misal: Es nya dikit, mi nya jangan terlalu matang)..."
              className="w-full mt-4 p-3 bg-[var(--bg)] border border-[var(--line)] rounded-2xl text-sm resize-none focus:outline-none focus:border-[var(--blue)]"
              rows={2}
            />

            <div className="flex justify-between items-baseline my-4 font-medium">
              <span className="text-[var(--muted)]">Total</span>
              <span className="font-bricolage font-extrabold text-2xl">{formatRp(totalPrice)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-[var(--blue)] text-[var(--on-blue)] rounded-2xl font-bold font-bricolage text-base active:scale-[0.98] transition-transform"
            >
              Pesan lewat WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
