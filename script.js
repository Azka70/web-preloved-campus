(function () {
  const KEY = 'preloved-items-v2', WKEY = 'preloved-wishlist-v1';
  const ME = { nama: 'Andi ', kampus: 'Universitas Negeri Surabaya', wa: '6281234567890' };
  const SARI = { nama: 'Sari Dewi', kampus: 'Universitas Negeri Surabaya', wa: '6281298765432' };

  const defaults = [
    { id: 1, nama: 'Buku Kalkulus Jilid 1', kategori: 'Buku & Catatan', harga: 45000, kondisi: 'Baik', lokasi: 'Dekat Kampus UNESA', deskripsi: 'Buku masih lengkap, ada sedikit coretan pensil di beberapa halaman. Cocok untuk mahasiswa tahun pertama.', foto: 'gambar/kalkulus.jpeg', penjual: ME, status: 'Tersedia' },
    { id: 2, nama: 'Kipas Angin Mini', kategori: 'Elektronik', harga: 60000, kondisi: 'Seperti Baru', lokasi: 'Area Kampus UNESA', deskripsi: 'Kipas mini USB, angin kencang, jarang dipakai.', foto: 'gambar/kipas.jpeg', penjual: ME, status: 'Tersedia' },
    { id: 3, nama: 'Jaket Almamater Size M', kategori: 'Fashion', harga: 120000, kondisi: 'Baik', lokasi: 'Dekat Kampus UNESA', deskripsi: 'Jaket almamater size M, bersih, tidak ada sobek.', foto: 'gambar/almet.jpeg', penjual: SARI, status: 'Tersedia' },
    { id: 4, nama: 'Rak Buku Lipat', kategori: 'Perlengkapan Kos', harga: 85000, kondisi: 'Layak Pakai', lokasi: 'Area Kampus UNESA', deskripsi: 'Rak buku lipat 4 tingkat, mudah dibawa.', foto: 'gambar/rak.jpeg', penjual: ME, status: 'Terjual' }
  ];

  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); localStorage.setItem(WKEY, JSON.stringify(wish)); }
    catch (e) { alert('Penyimpanan penuh. Coba pakai foto yang lebih kecil.'); }
  };

  let items = load(KEY, defaults);
  let wish = load(WKEY, [3]);
  let sel = items.length ? items[0].id : null;
  let query = '';

  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rp = (n) => 'Rp' + Number(n).toLocaleString('id-ID');
  const mine = (it) => it.penjual.nama === ME.nama;
  const waLink = (it) => {
    let n = String(it.penjual.wa || '').replace(/\D/g, '');
    if (n.startsWith('0')) n = '62' + n.slice(1);
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent('Halo, saya tertarik dengan ' + it.nama + ' di Preloved Campus');
  };
  const photo = (it, h) =>
    it.foto
      ? '<img src="' + esc(it.foto) + '" alt="' + esc(it.nama) + '" style="width:100%;height:' + h + ';object-fit:cover;display:block" onerror="this.outerHTML=\'Foto\'">'
      : 'Foto';

  function card(it) {
    const on = wish.includes(it.id);
    return '<article class="card' + (it.status === 'Terjual' ? ' sold' : '') + '">' +
      '<div class="card-img" style="height:170px;overflow:hidden">' + photo(it, '170px') +
      (it.status === 'Terjual' ? '<span class="badge-sold">Terjual</span>' : '') + '</div>' +
      '<div class="card-body"><span class="tag">' + esc(it.kategori) + '</span>' +
      '<h3>' + esc(it.nama) + '</h3><p class="price">' + rp(it.harga) + '</p>' +
      '<p class="meta">' + esc(it.kondisi) + ' · ' + esc(it.lokasi) + '</p>' +
      '<div class="card-actions"><a href="#detail" class="btn btn-small" data-act="detail" data-id="' + it.id + '">Lihat Detail</a>' +
      '<button class="icon-btn" data-act="wish" data-id="' + it.id + '" aria-label="Wishlist">' + (on ? '♥️' : '♡') + '</button></div></div></article>';
  }

  function filtered() {
    const s = document.querySelectorAll('.filters select');
    const val = (i) => (s[i].selectedIndex === 0 ? null : s[i].value);
    const kat = val(0), kon = val(2), lok = val(3), hg = s[1].selectedIndex;
    return items.filter((it) => {
      if (query && !it.nama.toLowerCase().includes(query.toLowerCase())) return false;
      if (kat && it.kategori !== kat) return false;
      if (kon && it.kondisi !== kon) return false;
      if (lok && it.lokasi !== lok) return false;
      if (hg === 1 && !(it.harga < 50000)) return false;
      if (hg === 2 && !(it.harga >= 50000 && it.harga <= 200000)) return false;
      if (hg === 3 && !(it.harga > 200000)) return false;
      return true;
    });
  }

  const empty = (t) => '<p class="meta">' + t + '</p>';

  function renderCatalog() {
    const list = filtered();
    $('#katalog .grid').innerHTML = list.length ? list.map(card).join('') : empty('Barang tidak ditemukan.');
  }

  function renderDetail() {
    const it = items.find((x) => x.id === sel);
    const box = $('#detail .detail');
    if (!it) { box.innerHTML = empty('Belum ada barang.'); return; }
    const on = wish.includes(it.id);
    box.innerHTML =
      '<div class="detail-img" style="overflow:hidden">' + photo(it, '100%') + '</div>' +
      '<div class="detail-info"><span class="tag">' + esc(it.kategori) + '</span><h3>' + esc(it.nama) + '</h3>' +
      '<p class="price big">' + rp(it.harga) + '</p><ul class="spec">' +
      '<li><strong>Kondisi:</strong> ' + esc(it.kondisi) + '</li><li><strong>Lokasi:</strong> ' + esc(it.lokasi) + '</li>' +
      '<li><strong>Status:</strong> ' + esc(it.status) + '</li></ul><p>' + esc(it.deskripsi || '-') + '</p>' +
      '<div class="seller-mini"><div class="avatar">' + esc(it.penjual.nama[0]) + '</div><div><strong>' + esc(it.penjual.nama) +
      '</strong><p class="meta">' + esc(it.penjual.kampus) + '</p></div><a href="#profil" class="link">Lihat Profil</a></div>' +
      '<div class="detail-actions"><a href="' + waLink(it) + '" target="_blank" rel="noopener" class="btn">Chat via WhatsApp</a>' +
      '<button class="btn btn-outline" data-act="wish" data-id="' + it.id + '">' + (on ? '♥️ Tersimpan' : '♡ Simpan') + '</button></div></div>';
  }

  function renderProfile() {
    const it = items.find((x) => x.id === sel);
    if (!it) return;
    const p = it.penjual;
    $('#profil .profile').innerHTML = '<div class="avatar large">' + esc(p.nama[0]) + '</div><div><h3>' + esc(p.nama) +
      '</h3><p class="meta">' + esc(p.kampus) + '</p></div>';
    const list = items.filter((x) => x.penjual.nama === p.nama);
    $('#profil .grid').innerHTML = list.map(card).join('');
  }

  function renderWishlist() {
    const list = items.filter((x) => wish.includes(x.id));
    $('#wishlist .grid').innerHTML = list.length ? list.map(card).join('') : empty('Wishlist masih kosong.');
  }

  function renderKelola() {
    const list = items.filter(mine);
    $('#kelola tbody').innerHTML = list.length ? list.map((it) =>
      '<tr><td>' + esc(it.nama) + '</td><td>' + rp(it.harga) + '</td><td><span class="status ' + (it.status === 'Terjual' ? 'done' : 'ok') + '">' + it.status + '</span></td>' +
      '<td class="actions"><button class="btn btn-small" data-act="edit" data-id="' + it.id + '">Edit</button>' +
      '<button class="btn btn-small btn-outline" data-act="sold" data-id="' + it.id + '">' + (it.status === 'Terjual' ? 'Tandai Tersedia' : 'Tandai Terjual') + '</button>' +
      '<button class="btn btn-small btn-danger" data-act="del" data-id="' + it.id + '">Hapus</button></td></tr>'
    ).join('') : '<tr><td colspan="4">Belum ada barang yang dijual.</td></tr>';
  }

  function renderAll() {
    if (!items.find((x) => x.id === sel) && items.length) sel = items[0].id;
    renderCatalog(); renderDetail(); renderProfile(); renderWishlist(); renderKelola();
  }

  // ===== Klik tombol =====
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const id = Number(b.dataset.id);
    const it = items.find((x) => x.id === id);
    const act = b.dataset.act;
    if (act === 'detail') { sel = id; renderDetail(); renderProfile(); }
    else if (act === 'wish') { wish = wish.includes(id) ? wish.filter((w) => w !== id) : wish.concat(id); save(); renderAll(); }
    else if (act === 'sold') { it.status = it.status === 'Terjual' ? 'Tersedia' : 'Terjual'; save(); renderAll(); }
    else if (act === 'del') { if (confirm('Hapus "' + it.nama + '"?')) { items = items.filter((x) => x.id !== id); wish = wish.filter((w) => w !== id); save(); renderAll(); } }
    else if (act === 'edit') {
      const n = prompt('Nama barang:', it.nama); if (n === null) return;
      const h = prompt('Harga (angka):', it.harga); if (h === null) return;
      if (n.trim()) it.nama = n.trim();
      if (Number(h) > 0) it.harga = Number(h);
      save(); renderAll();
    }
  });

  // ===== Cari & filter =====
  const heroForm = $('.search-bar'), heroInput = $('.search-bar input');
  heroForm.addEventListener('submit', (e) => { e.preventDefault(); query = heroInput.value.trim(); renderCatalog(); location.hash = '#katalog'; });
  heroInput.addEventListener('input', () => { query = heroInput.value.trim(); renderCatalog(); });
  $('.filters').addEventListener('submit', (e) => { e.preventDefault(); renderCatalog(); });
  document.querySelectorAll('.filters select').forEach((s) => s.addEventListener('change', renderCatalog));

  // ===== Jual barang =====
  function resize(file, cb) {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const sc = Math.min(1, 600 / img.width), c = document.createElement('canvas');
        c.width = img.width * sc; c.height = img.height * sc;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', 0.7));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  }

  const form = $('#jual form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = form.elements;
    if (!f[0].value.trim() || !(Number(f[3].value) > 0)) { alert('Isi nama barang dan harga dulu ya.'); return; }
    const done = (foto) => {
      items.push({
        id: Date.now(), nama: f[0].value.trim(), kategori: f[1].value, kondisi: f[2].value,
        harga: Number(f[3].value), lokasi: f[4].value.trim() || '-', deskripsi: f[6].value.trim(),
        foto: foto, penjual: { nama: ME.nama, kampus: ME.kampus, wa: f[5].value.trim() || ME.wa }, status: 'Tersedia'
      });
      save(); renderAll(); form.reset();
      alert('Barang berhasil dipublikasikan!');
      location.hash = '#katalog';
    };
    f[7].files[0] ? resize(f[7].files[0], done) : done('');
  });

  // ===== Menu Kelola di navbar =====
  const nav = $('.navbar nav');
  if (!nav.querySelector('[href="#kelola"]')) {
    const a = document.createElement('a');
    a.href = '#kelola'; a.textContent = 'Kelola';
    nav.insertBefore(a, nav.querySelector('.btn'));
  }

  renderAll();
})();