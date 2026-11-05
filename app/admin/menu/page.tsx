'use client';

import React, { useState } from 'react';
import { INITIAL_PRODUCTS, Product } from '@/app/data';
import { Plus, Pencil, Camera, Check } from 'lucide-react';

const CATS = [
  { id: 'mk', name: 'Makanan' },
  { id: 'mn', name: 'Minuman' },
  { id: 'sn', name: 'Snack' }
];

export default function AdminMenu() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [filter, setFilter] = useState<string>('all');
  const [toast, setToast] = useState<string>('');
  
  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form state
  const [fName, setFName] = useState('');
  const [fPrice, setFPrice] = useState('');
  const [fCat, setFCat] = useState<'mk' | 'mn' | 'sn'>('mk');
  const [fOk, setFOk] = useState(true);
  const [fImg, setFImg] = useState('');

  const formatRp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleStatus = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextOk = !p.ok;
          showToast(`${p.name} ditandai ${nextOk ? 'tersedia' : 'habis'}`);
          return { ...p, ok: nextOk };
        }
        return p;
      })
    );
  };

  const openSheet = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFName(p.name);
      setFPrice(p.price.toLocaleString('id-ID'));
      setFCat(p.cat);
      setFOk(p.ok);
      setFImg(p.img || '');
    } else {
      setEditingProduct(null);
      setFName('');
      setFPrice('');
      setFCat('mk');
      setFOk(true);
      setFImg('');
    }
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    const priceNum = parseInt(fPrice.replace(/\D/g, ''), 10) || 0;
    if (!fName.trim() || priceNum <= 0) return;

    if (editingProduct) {
      setProducts(prev =>
        prev.map(p => (p.id === editingProduct.id ? { ...p, name: fName, price: priceNum, cat: fCat, ok: fOk, img: fImg } : p))
      );
      showToast('Perubahan disimpan');
    } else {
      const newP: Product = {
        id: 'p' + Date.now(),
        name: fName,
        price: priceNum,
        cat: fCat,
        ok: fOk,
        sold: 0,
        emoji: '🍽️',
        tint: '#E6E9F5',
        img: fImg
      };
      setProducts(prev => [newP, ...prev]);
      showToast(`${newP.name} ditambahkan`);
    }
    setIsSheetOpen(false);
  };

  const handleDelete = () => {
    if (!editingProduct) return;
    setProducts(prev => prev.filter(p => p.id !== editingProduct.id));
    showToast(`${editingProduct.name} dihapus`);
    setIsSheetOpen(false);
  };

  const filtered = products
    .filter(p => filter === 'all' || p.cat === filter)
    .sort((a, b) => b.sold - a.sold);

  const offCount = products.filter(p => !p.ok).length;

  return (
    <div className="max-w-[640px] mx-auto pb-24 min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Intro */}
      <section className="px-5 pt-5 pb-2">
        <div className="flex justify-between items-center">
          <div className="font-extrabold text-lg tracking-tight font-bricolage">K Gaming</div>
          <div className="text-sm font-semibold text-[var(--muted)]">Admin</div>
        </div>
        <div className="flex justify-between items-end mt-8">
          <div>
            <h1 className="font-extrabold text-[34px] leading-tight tracking-tight font-bricolage">Kelola menu</h1>
            <p className="text-[var(--muted)] mt-1 text-sm">
              {products.length} menu{offCount ? `, ${offCount} habis` : ', semua tersedia'}
            </p>
          </div>
          <button
            onClick={() => openSheet()}
            className="flex items-center gap-2 bg-[var(--ink)] text-[var(--bg)] px-4 py-2.5 rounded-full font-semibold text-sm active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      </section>

      {/* Tabs */}
      <nav className="sticky top-0 z-10 flex gap-6 px-5 mt-4 bg-[var(--bg)] border-b border-[var(--line)]">
        {[{ id: 'all', name: 'Semua' }, ...CATS].map(c => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`relative pb-3.5 font-semibold text-sm transition-colors ${
              filter === c.id ? 'text-[var(--ink)]' : 'text-[var(--muted)]'
            }`}
          >
            {c.name}
            {filter === c.id && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--blue)] rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* List */}
      <main className="px-5 mt-2">
        {filtered.map(p => (
          <div key={p.id} className={`grid grid-cols-[60px_1fr_auto_auto] gap-3.5 items-center py-3 border-b border-[var(--line)] ${!p.ok ? 'opacity-50' : ''}`}>
            <div className="w-[60px] h-[60px] rounded-[18px] grid place-items-center text-2xl overflow-hidden" style={{ backgroundColor: p.tint }}>
              {p.img ? <img src={p.img} alt="" className="w-full h-full object-cover" /> : p.emoji}
            </div>
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-[var(--muted)]">{formatRp(p.price)} • {p.sold} terjual</div>
            </div>
            <button
              onClick={() => openSheet(p)}
              className="w-9 h-9 rounded-full grid place-items-center text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleStatus(p.id)}
              className={`relative w-12 h-7 rounded-full transition-colors ${p.ok ? 'bg-[var(--blue)]' : 'bg-[var(--line)]'}`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${p.ok ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        ))}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--ink)] text-[var(--bg)] px-5 py-3 rounded-2xl shadow-xl font-medium text-sm">
          {toast}
        </div>
      )}

      {/* Sheet Modal */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSheetOpen(false)} />
          <div className="relative w-full max-w-[480px] bg-[var(--surface)] rounded-t-[28px] p-6 pb-8 z-50 max-h-[90vh] flex flex-col">
            <div className="w-9 h-1 bg-[var(--line)] rounded-full mx-auto mb-4" />
            <h2 className="font-bricolage font-bold text-2xl mb-5">{editingProduct ? 'Ubah menu' : 'Tambah menu'}</h2>

            <div className="overflow-y-auto flex-1 space-y-4 pb-4">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setFImg(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="w-20 h-20 rounded-[22px] border-2 border-dashed border-[var(--sold)] grid place-items-center overflow-hidden text-[var(--muted)]">
                  {fImg ? <img src={fImg} alt="" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6" />}
                </div>
                <span className="font-semibold text-sm">{fImg ? 'Ganti foto' : 'Unggah foto'}</span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Nama menu</label>
                <input
                  type="text"
                  value={fName}
                  onChange={e => setFName(e.target.value)}
                  placeholder="Contoh: Nasi Goreng Sosis"
                  className="w-full p-3 bg-[var(--bg)] border border-[var(--line)] rounded-2xl text-sm focus:outline-none focus:border-[var(--blue)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Kategori</label>
                <div className="flex bg-[var(--bg)] p-1 rounded-2xl">
                  {CATS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setFCat(c.id as any)}
                      className={`flex-1 py-2 font-semibold text-sm rounded-xl transition-colors ${
                        fCat === c.id ? 'bg-[var(--surface)] shadow-sm text-[var(--ink)]' : 'text-[var(--muted)]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5">Harga</label>
                <div className="flex items-center bg-[var(--bg)] border border-[var(--line)] rounded-2xl px-3 focus-within:border-[var(--blue)]">
                  <span className="text-[var(--muted)] text-sm mr-2">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={fPrice}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFPrice(val ? parseInt(val, 10).toLocaleString('id-ID') : '');
                    }}
                    placeholder="0"
                    className="w-full py-3 bg-transparent text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <div className="font-semibold text-sm">Tersedia</div>
                  <div className="text-xs text-[var(--muted)]">Matikan saat stok habis</div>
                </div>
                <button
                  onClick={() => setFOk(!fOk)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${fOk ? 'bg-[var(--blue)]' : 'bg-[var(--line)]'}`}
                >
                  <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${fOk ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!fName.trim() || !fPrice}
              className="w-full mt-2 py-4 bg-[var(--blue)] text-[var(--on-blue)] rounded-2xl font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-40"
            >
              {editingProduct ? 'Simpan perubahan' : 'Tambah menu'}
            </button>

            {editingProduct && (
              <button
                onClick={handleDelete}
                className="w-full py-3 mt-2 text-[var(--danger)] font-semibold text-sm rounded-2xl hover:bg-red-50 transition-colors"
              >
                Hapus menu
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
