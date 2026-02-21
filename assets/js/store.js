async function loadProducts() {
  const res = await fetch("../../data/products.json?ts=" + Date.now());
  if (!res.ok) throw new Error("Cannot load products.json");
  return res.json();
}

function formatPriceIRR(n) {
  try {
    return n.toLocaleString("fa-IR") + " ریال";
  } catch {
    return n + " ریال";
  }
}

function buildCard(p) {
  const card = document.createElement("div");
  card.className = "p-card";

  const title = document.createElement("h3");
  title.textContent = p.title;

  const meta = document.createElement("div");
  meta.className = "p-meta";
  meta.textContent = `${p.category} • ${p.level}`;

  const desc = document.createElement("p");
  desc.className = "p-desc";
  desc.textContent = p.description || "";

  const price = document.createElement("div");
  price.className = "p-price";
  price.textContent = p.price ? formatPriceIRR(p.price) : "";

  const btn = document.createElement("a");
  btn.className = "p-btn";

  if (p.status === "active" && p.file) {
    btn.href = p.file;
    btn.target = "_blank";
    btn.rel = "noopener";
    btn.textContent = "دریافت / خرید";
  } else {
    btn.href = "#";
    btn.textContent = "در حال توسعه";
    btn.onclick = (e) => {
      e.preventDefault();
      alert("این محصول در حال توسعه است و به‌زودی فعال می‌شود.");
    };
    btn.style.opacity = "0.85";
  }

  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(desc);
  card.appendChild(price);
  card.appendChild(btn);

  return card;
}

function renderCategories(products) {
  const cats = [...new Set(products.map(p => p.category))];
  const sel = document.getElementById("catFilter");
  sel.innerHTML = `<option value="all">همه دسته‌ها</option>`;
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}

function renderProducts(products, selectedCat) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const list = selectedCat && selectedCat !== "all"
    ? products.filter(p => p.category === selectedCat)
    : products;

  list.forEach(p => grid.appendChild(buildCard(p)));

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "فعلاً محصولی در این دسته ثبت نشده است.";
    grid.appendChild(empty);
  }
}

async function initStore() {
  try {
    const data = await loadProducts();
    const products = data.products || [];

    renderCategories(products);
    renderProducts(products, "all");

    const sel = document.getElementById("catFilter");
    sel.addEventListener("change", () => {
      renderProducts(products, sel.value);
    });
  } catch (err) {
    console.error(err);
    alert("خطا در بارگذاری فروشگاه. لطفاً بعداً دوباره تلاش کنید.");
  }
}

document.addEventListener("DOMContentLoaded", initStore);
