(() => {
  const S = window.IcareStore;
  const session = S.requireAuth();
  if (!session) return;

  const view = document.getElementById("view");
  const toastStack = document.getElementById("toast-stack");
  const modalLayer = document.getElementById("modal-layer");
  const sidebar = document.getElementById("collapseExample");
  const backdrop = document.getElementById("sidebar-backdrop");
  const titles = {
    inicio: "Início",
    gestao: "Gestão e Pagamentos",
    repasses: "Repasses iFood",
    cardapio: "Cardápio",
    analises: "Relatórios e Análises",
    seguranca: "Segurança e Acesso",
    mensagens: "Mensagens",
  };

  let charts = [];
  let activeThread = "t1";
  let sortState = { key: "time", dir: 1 };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const statusClass = (status) => {
    if (status === "Concluído" || status === "Pago" || status === "Antecipado") return "ok";
    if (status === "Pendente" || status === "Em preparo" || status === "Agendado" || status === "Aberto") return "wait";
    return "no";
  };

  const payMeta = {
    Pix: { icon: "./public/icons/icon-pix-logo.svg", hint: "Cai na hora no iFood Pago" },
    Crédito: { icon: "./public/icons/icon-credit-card.svg", hint: "Repasse em D+7" },
    Débito: { icon: "./public/icons/icon-debit-card.svg", hint: "Repasse em D+1" },
    Dinheiro: { icon: "./public/icons/icon-brand-cashapp.svg", hint: "Recebido no balcão" },
  };

  const toast = (message) => {
    const el = document.createElement("div");
    el.className = "icare-toast";
    el.textContent = message;
    toastStack.appendChild(el);
    if (window.gsap && !reduceMotion) gsap.from(el, { y: 20, opacity: 0, duration: 0.35 });
    setTimeout(() => {
      if (window.gsap && !reduceMotion) {
        gsap.to(el, { y: 12, opacity: 0, duration: 0.25, onComplete: () => el.remove() });
      } else {
        el.remove();
      }
    }, 2800);
  };

  const closeModal = () => {
    modalLayer.classList.remove("open");
    modalLayer.innerHTML = "";
  };

  const openModal = (html) => {
    modalLayer.innerHTML = `<div class="modal-sheet">${html}</div>`;
    modalLayer.classList.add("open");
    if (window.gsap && !reduceMotion) gsap.from(".modal-sheet", { y: 40, opacity: 0, duration: 0.35, ease: "power3.out" });
  };

  const closeSidebar = () => {
    sidebar.classList.remove("is-open", "show");
    backdrop.classList.remove("show");
  };

  const toggleSidebar = () => {
    const open = sidebar.classList.toggle("is-open");
    sidebar.classList.toggle("show", open);
    backdrop.classList.toggle("show", open);
  };

  const unreadMessages = () => S.threads().reduce((sum, thread) => sum + (thread.unread || 0), 0);
  const unreadNotices = () => S.notices().filter((item) => item.unread).length;

  const updateBadges = () => {
    const msg = unreadMessages();
    const notices = unreadNotices();
    document.querySelectorAll("[data-msg-count]").forEach((el) => {
      el.textContent = msg;
      el.hidden = msg === 0;
    });
    document.querySelectorAll("[data-msg-count-dot]").forEach((el) => el.classList.toggle("d-none", msg === 0));
    document.querySelectorAll("[data-notice-dot]").forEach((el) => {
      if (el.classList.contains("nav-badge")) {
        el.textContent = String(notices);
        el.hidden = notices === 0;
      } else {
        el.classList.toggle("d-none", notices === 0);
      }
    });
    document.getElementById("user-name").textContent = session.name;
    document.getElementById("user-role").textContent = session.role;
  };

  const setActiveNav = (route) => {
    document.querySelectorAll("[data-route]").forEach((link) => {
      link.classList.toggle("active", link.dataset.route === route);
    });
    document.getElementById("page-title").textContent = titles[route] || "Início";
    document.getElementById("crumb").textContent = titles[route] || "Início";
  };

  const killCharts = () => {
    charts.forEach((chart) => chart.destroy());
    charts = [];
  };

  const animateView = () => {
    if (!window.gsap || reduceMotion) return;
    gsap.from("#view .page-animate", { y: 18, opacity: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" });
    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = S.money(obj.val);
        },
      });
    });
  };

  const metrics = (orders = S.orders()) => {
    const done = orders.filter((o) => o.status === "Concluído");
    const canceled = orders.filter((o) => o.status === "Cancelado");
    const revenue = done.reduce((s, o) => s + o.value, 0);
    const lost = canceled.reduce((s, o) => s + o.value, 0);
    const cost = revenue * 0.28;
    return {
      revenue,
      cost,
      profit: revenue - cost,
      canceled: lost,
      count: orders.length,
    };
  };

  const byPayment = (orders) => {
    const done = orders.filter((o) => o.status === "Concluído");
    const grand = done.reduce((s, o) => s + o.value, 0) || 1;
    return ["Pix", "Crédito", "Débito", "Dinheiro"].map((type) => {
      const list = done.filter((o) => o.payment === type);
      const total = list.reduce((s, o) => s + o.value, 0);
      const fee = type === "Dinheiro" ? 0 : total * 0.12;
      return {
        type,
        total,
        count: list.length,
        ticket: list.length ? total / list.length : 0,
        share: (total / grand) * 100,
        fee,
        net: total - fee,
      };
    });
  };

  const finance = (orders = S.orders()) => {
    const done = orders.filter((o) => o.status === "Concluído");
    const open = orders.filter((o) => o.status === "Pendente" || o.status === "Em preparo");
    const gross = done.reduce((s, o) => s + o.value, 0);
    const digital = done.filter((o) => o.payment !== "Dinheiro").reduce((s, o) => s + o.value, 0);
    const cash = done.filter((o) => o.payment === "Dinheiro").reduce((s, o) => s + o.value, 0);
    const fee = digital * 0.12;
    const next = S.payouts().find((p) => p.status === "Agendado") || S.payouts().find((p) => p.status === "Aberto");
    return {
      gross,
      fee,
      net: gross - fee,
      cash,
      openCount: open.length,
      openValue: open.reduce((s, o) => s + o.value, 0),
      next,
    };
  };

  const weekSeries = (orders) => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    return {
      labels: days.map((d) => new Date(`${d}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "short" })),
      values: days.map((d) => orders.filter((o) => o.date === d && o.status === "Concluído").reduce((s, o) => s + o.value, 0)),
    };
  };

  const rank = (items, key) => {
    const map = {};
    items.forEach((item) => {
      const name = item[key];
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const productRank = (orders) => {
    const map = {};
    orders.forEach((order) => {
      order.items.split(",").forEach((raw) => {
        const name = raw.trim();
        map[name] = (map[name] || 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const tableRows = (orders, extra = "") =>
    orders
      .map(
        (order) => `
        <tr class="order-row" data-id="${order.id}">
          <td class="text-primary">${order.customer}</td>
          <td>${order.items}</td>
          <td>${order.payment}</td>
          <td>${S.money(order.value)}</td>
          <td>${order.date.split("-").reverse().join("/")} ${order.time}</td>
          <td><span class="status-pill ${statusClass(order.status)}">${order.status}</span></td>
          ${extra}
        </tr>`
      )
      .join("");

  const headerActions = `
    <div class="header-actions d-flex align-items-center gap-2">
      <button class="btn btn-light" data-go="mensagens" aria-label="Mensagens">
        <icon-set imageUrl="./public/icons/icon-brand-messenger.svg"></icon-set>
        <span class="dot-alert" data-notice-dot data-msg-count-dot></span>
      </button>
      <button class="btn btn-light" data-open="notices" aria-label="Notificações">
        <icon-set imageUrl="./public/icons/icon-bell.svg"></icon-set>
        <span class="dot-alert" data-notice-dot></span>
      </button>
      <button class="btn btn-primary rounded-pill navbar-toggler" data-toggle-sidebar aria-label="Abrir menu">
        <icon-set imageUrl="./public/icons/icon-menu-outline.svg"></icon-set>
      </button>
    </div>`;

  const renderNotices = () => {
    const items = S.notices()
      .map(
        (item) => `
        <button class="notification-item ${item.unread ? "new" : ""} w-100 text-start border-0" data-read="${item.id}">
          <div class="rounded-pills p-i me-3">
            <img src="${item.image}" width="40" class="object-fit-cover border rounded-pill" alt="">
          </div>
          <div class="flex-fill pe-2 overflow-hidden">
            <small class="name d-block pe-2">${item.title}</small>
            <small class="text-body-tertiary">${item.text}</small>
          </div>
        </button>`
      )
      .join("");
    openModal(`<div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="m-0">Notificações</h5>
      <button class="btn btn-sm btn-light" data-close-modal>Fechar</button>
    </div>${items || "<p>Nenhuma notificação.</p>"}`);
  };

  const makeChart = (id, config) => {
    const canvas = document.getElementById(id);
    if (!canvas || !window.Chart) return;
    charts.push(new Chart(canvas, config));
  };

  const renderHome = () => {
    const orders = [...S.orders()].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
    const m = metrics(orders);
    const week = weekSeries(orders);
    const pay = byPayment(orders);
    view.innerHTML = `
      <div class="container-fluid pb-4">
        <div class="row mt-3">
          ${[
            ["Gastos", m.cost, 8],
            ["Lucro", m.profit, 12],
            ["Total de pedidos", m.revenue, 15],
            ["Pedidos cancelados", m.canceled, 5],
          ]
            .map(
              ([label, value, pct]) => `
            <div class="col-12 my-2 col-sm-6 col-xl-3 page-animate">
              <div class="card h-100 kpi-card">
                <div class="card-header d-flex"><h6 class="card-title flex-fill m-0 text-secondary">${label}</h6></div>
                <div class="card-body"><h4 class="card-text" data-count="${value}">${S.money(value)}</h4></div>
                <div class="card-footer"><small><span class="text-success">↑ ${pct}%</span> vs. mês anterior</small></div>
              </div>
            </div>`
            )
            .join("")}
        </div>
        ${(() => {
          const live = orders.filter((o) => o.status === "Pendente" || o.status === "Em preparo");
          const next = S.payouts().find((p) => p.status === "Agendado");
          if (!live.length && !next) return "";
          return `<div class="row mt-1">
            <div class="col-12 col-lg-7 my-2 page-animate">
              <div class="card anim-card">
                <div class="card-header"><h6 class="m-0 text-secondary">Cozinha agora</h6></div>
                <div class="card-body">
                  ${
                    live.length
                      ? live
                          .map(
                            (o) => `<div class="d-flex justify-content-between align-items-center border-bottom py-2">
                              <div><strong>${o.customer}</strong><br><small>${o.items}</small></div>
                              <div class="text-end"><span class="status-pill ${statusClass(o.status)}">${o.status}</span><br><button class="btn btn-sm btn-primary mt-1" data-status="${o.id}:Concluído">Concluir</button></div>
                            </div>`
                          )
                          .join("")
                      : '<p class="small text-body-tertiary mb-0">Nenhum pedido na fila.</p>'
                  }
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-5 my-2 page-animate">
              <div class="card kpi-card h-100">
                <div class="card-header"><h6 class="m-0 text-secondary">Próximo repasse iFood</h6></div>
                <div class="card-body">
                  <h4>${S.money(next?.net || 0)}</h4>
                  <p class="small text-body-tertiary">${next ? next.period + " · depósito em " + next.date.split("-").reverse().join("/") : "Sem ciclo aberto"}</p>
                  <a class="btn btn-outline-primary btn-sm" href="#/repasses">Abrir repasses</a>
                </div>
              </div>
            </div>
          </div>`;
        })()}
        <div class="row mt-2">
          <div class="col-12 my-2 col-lg-8 page-animate">
            <div class="card anim-card">
              <div class="card-header"><h6 class="m-0 text-secondary">Pedidos da semana</h6></div>
              <div class="card-body"><div class="chart-wrap"><canvas id="weekChart"></canvas></div></div>
            </div>
          </div>
          <div class="col-12 my-2 col-lg-4 page-animate">
            <div class="card h-100 anim-card">
              <div class="card-header"><h6 class="m-0 text-secondary">Média por pagamento</h6></div>
              <div class="card-body"><div class="chart-wrap"><canvas id="payChart"></canvas></div></div>
            </div>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-12 page-animate">
            <div class="card overflow-auto anim-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="my-2">Últimos pedidos</h6>
                <input class="form-control" style="max-width:240px" id="home-search" placeholder="Buscar cliente ou item">
              </div>
              <div class="table-responsive">
                <table class="table table-hover mb-0" id="home-table">
                  <thead>
                    <tr>
                      <th>Nome</th><th>Itens</th><th>Pagamento</th><th>Valor</th><th>Hora</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>${tableRows(orders)}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    makeChart("weekChart", {
      type: "line",
      data: {
        labels: week.labels,
        datasets: [{
          data: week.values,
          borderColor: "#EA0033",
          backgroundColor: "rgba(234,0,51,.12)",
          fill: true,
          tension: 0.4,
        }],
      },
      options: { plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } },
    });
    makeChart("payChart", {
      type: "doughnut",
      data: {
        labels: pay.map((p) => p.type),
        datasets: [{ data: pay.map((p) => p.total), backgroundColor: ["#EA0033", "#FF99AF", "#FFC107", "#6C757D"] }],
      },
      options: { plugins: { legend: { position: "bottom" } }, maintainAspectRatio: false },
    });

    document.getElementById("home-search").addEventListener("input", (ev) => {
      const q = ev.target.value.toLowerCase();
      const filtered = orders.filter((o) => `${o.customer} ${o.items} ${o.payment}`.toLowerCase().includes(q));
      document.querySelector("#home-table tbody").innerHTML = tableRows(filtered);
    });
  };

  const renderGestao = () => {
    const all = S.orders();
    const pay = byPayment(all);
    const fin = finance(all);
    const menu = S.menu().filter((item) => item.available);
    view.innerHTML = `
      <div class="container-fluid pb-4">
        <div class="row mt-3">
          <div class="col-12 col-md-6 col-xl-3 my-2 page-animate">
            <div class="card kpi-card h-100">
              <div class="card-header"><h6 class="m-0 text-secondary">Líquido após taxa iFood</h6></div>
              <div class="card-body">
                <h4 data-count="${fin.net}">${S.money(fin.net)}</h4>
                <small class="text-body-tertiary">Bruto ${S.money(fin.gross)}</small>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-xl-3 my-2 page-animate">
            <div class="card kpi-card h-100">
              <div class="card-header"><h6 class="m-0 text-secondary">Taxa da plataforma</h6></div>
              <div class="card-body">
                <h4 data-count="${fin.fee}">${S.money(fin.fee)}</h4>
                <small class="text-body-tertiary">12% em Pix, crédito e débito</small>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-xl-3 my-2 page-animate">
            <div class="card kpi-card h-100">
              <div class="card-header"><h6 class="m-0 text-secondary">Próximo repasse</h6></div>
              <div class="card-body">
                <h4 data-count="${fin.next?.net || 0}">${S.money(fin.next?.net || 0)}</h4>
                <small class="text-body-tertiary">${fin.next ? fin.next.date.split("-").reverse().join("/") + " · " + fin.next.period : "Sem ciclo"}</small>
              </div>
              <div class="card-footer"><a href="#/repasses" class="small">Ver agenda de repasses</a></div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-xl-3 my-2 page-animate">
            <div class="card kpi-card h-100">
              <div class="card-header"><h6 class="m-0 text-secondary">Em andamento</h6></div>
              <div class="card-body">
                <h4>${fin.openCount}</h4>
                <small class="text-body-tertiary">${S.money(fin.openValue)} ainda não concluídos</small>
              </div>
            </div>
          </div>
        </div>
        <div class="row my-2">
          ${pay
            .map(
              (item) => `
            <div class="col-12 col-sm-6 col-xl-3 my-2 page-animate">
              <div class="card pay-card h-100">
                <div class="card-header d-flex align-items-center gap-2">
                  <icon-set class="colored-icon" imageUrl="${payMeta[item.type].icon}"></icon-set>
                  <h6 class="m-0 flex-fill">${item.type}</h6>
                </div>
                <div class="card-body">
                  <h5 data-count="${item.total}">${S.money(item.total)}</h5>
                  <p class="mb-1 small text-body-tertiary">${item.count} pedidos · ticket ${S.money(item.ticket)}</p>
                  <div class="progress mb-2" role="progressbar" aria-label="Participação ${item.type}">
                    <div class="progress-bar bg-primary" style="width:${Math.max(item.share, 2).toFixed(1)}%"></div>
                  </div>
                  <small>${item.share.toFixed(0)}% do faturamento</small>
                </div>
                <div class="card-footer">
                  <small>${payMeta[item.type].hint}<br>Líquido ${S.money(item.net)}</small>
                </div>
              </div>
            </div>`
            )
            .join("")}
        </div>
        <div class="row my-2">
          <div class="col-12 col-xl-5 my-2 page-animate">
            <div class="card h-100 anim-card">
              <div class="card-header"><h6 class="m-0 text-secondary">Volume por forma de pagamento</h6></div>
              <div class="card-body"><div class="chart-wrap"><canvas id="gestaoChart"></canvas></div></div>
            </div>
          </div>
          <div class="col-12 col-xl-7 my-2 page-animate">
            <div class="card h-100 anim-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="m-0 text-secondary">Registrar venda</h6>
              </div>
              <div class="card-body">
                <form id="quick-order" class="row g-2">
                  <div class="col-12 col-md-6">
                    <label class="form-label">Cliente</label>
                    <input required class="form-control" name="customer" placeholder="Nome do cliente">
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label">Item</label>
                    <select class="form-select" name="items">${menu.map((p) => `<option value="${p.name}">${p.name} · ${S.money(p.price)}</option>`).join("")}</select>
                  </div>
                  <div class="col-6 col-md-4">
                    <label class="form-label">Pagamento</label>
                    <select class="form-select" name="payment"><option>Pix</option><option>Crédito</option><option>Débito</option><option>Dinheiro</option></select>
                  </div>
                  <div class="col-6 col-md-4">
                    <label class="form-label">Valor (R$)</label>
                    <input required type="number" min="1" step="0.01" class="form-control" name="value" value="${menu[0]?.price || 29.9}">
                  </div>
                  <div class="col-12 col-md-4 d-flex align-items-end">
                    <button class="btn btn-primary w-100" type="submit">Lançar pedido</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="row form-filter page-animate">
          <div class="col-6 col-lg-3"><div class="form-floating mb-3"><input type="date" class="form-control" id="data_inicio"><label>Data início</label></div></div>
          <div class="col-6 col-lg-3"><div class="form-floating mb-3"><input type="date" class="form-control" id="data_fim"><label>Data fim</label></div></div>
          <div class="col-6 col-lg-3"><div class="form-floating mb-3">
            <select id="tipos_pagamento" class="form-select">
              <option value="todos">Todos</option>
              <option value="Pix">Pix</option>
              <option value="Débito">Débito</option>
              <option value="Crédito">Crédito</option>
              <option value="Dinheiro">Dinheiro</option>
            </select><label>Tipo de pagamento</label>
          </div></div>
          <div class="col-6 col-lg-3"><div class="form-floating mb-3"><input type="number" class="form-control" id="valor" min="0" step="0.01" value="0"><label>Valor mínimo (R$)</label></div></div>
        </div>
        <div class="card anim-card page-animate">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="m-0">Movimentação financeira</h6>
            <span id="filter-count"></span>
          </div>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead><tr><th>Data</th><th>Cliente</th><th>Tipo</th><th>Valor</th><th>Taxa</th><th>Líquido</th><th>Status</th><th></th></tr></thead>
              <tbody id="gestao-body"></tbody>
            </table>
          </div>
        </div>
      </div>`;

    makeChart("gestaoChart", {
      type: "bar",
      data: {
        labels: pay.map((p) => p.type),
        datasets: [{ data: pay.map((p) => p.total), backgroundColor: ["#EA0033", "#FF99AF", "#FFC107", "#6C757D"], borderRadius: 8 }],
      },
      options: { plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } },
    });

    const apply = () => {
      const start = document.getElementById("data_inicio").value;
      const end = document.getElementById("data_fim").value;
      const type = document.getElementById("tipos_pagamento").value;
      const min = Number(document.getElementById("valor").value || 0);
      const rows = all.filter((o) => {
        if (start && o.date < start) return false;
        if (end && o.date > end) return false;
        if (type !== "todos" && o.payment !== type) return false;
        if (o.value < min) return false;
        return true;
      });
      document.getElementById("filter-count").textContent = `${rows.length} lançamentos`;
      document.getElementById("gestao-body").innerHTML = rows
        .map((o) => {
          const fee = o.payment === "Dinheiro" || o.status === "Cancelado" ? 0 : o.value * 0.12;
          const net = o.status === "Cancelado" ? 0 : o.value - fee;
          return `
          <tr>
            <td>
              <details>
                <summary>${o.date.split("-").reverse().join("/")} ${o.time}</summary>
                <div class="p-2"><strong>Itens:</strong> ${o.items}<br>Entregador: ${o.delivery}</div>
              </details>
            </td>
            <td class="text-primary">${o.customer}</td>
            <td>${o.payment}</td>
            <td>${S.money(o.value)}</td>
            <td>${S.money(fee)}</td>
            <td>${S.money(net)}</td>
            <td><span class="status-pill ${statusClass(o.status)}">${o.status}</span></td>
            <td>
              ${o.status === "Pendente" || o.status === "Em preparo" ? `<button class="btn btn-sm btn-primary" data-status="${o.id}:Concluído">Concluir</button>` : ""}
              ${o.status !== "Cancelado" && o.status !== "Concluído" ? `<button class="btn btn-sm btn-outline-danger" data-status="${o.id}:Cancelado">Cancelar</button>` : ""}
            </td>
          </tr>`;
        })
        .join("");
    };

    ["data_inicio", "data_fim", "tipos_pagamento", "valor"].forEach((id) => {
      document.getElementById(id).addEventListener("input", apply);
      document.getElementById(id).addEventListener("change", apply);
    });
    const quick = document.getElementById("quick-order");
    const itemSelect = quick.querySelector('[name="items"]');
    const valueInput = quick.querySelector('[name="value"]');
    itemSelect.addEventListener("change", () => {
      const product = S.menu().find((p) => p.name === itemSelect.value);
      if (product) valueInput.value = product.price;
    });
    quick.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(quick).entries());
      const now = new Date();
      const order = {
        id: S.uid("p"),
        customer: data.customer,
        items: data.items,
        payment: data.payment,
        value: Number(data.value),
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
        status: "Em preparo",
        delivery: "A definir",
      };
      S.saveOrders([order, ...S.orders()]);
      toast("Pedido lançado na cozinha.");
      render();
    });
    apply();
  };

  const renderRepasses = () => {
    const list = S.payouts();
    const paid = list.filter((p) => p.status === "Pago" || p.status === "Antecipado").reduce((s, p) => s + p.net, 0);
    const next = list.find((p) => p.status === "Agendado");
    view.innerHTML = `
      <div class="container-fluid pb-4">
        <p class="text-body-tertiary page-animate mt-3">O Icare Finance consolida o ciclo de pagamento do parceiro iFood: bruto, taxa e líquido na conta.</p>
        <div class="row">
          <div class="col-12 col-md-4 my-2 page-animate">
            <div class="card kpi-card h-100">
              <div class="card-header"><h6 class="m-0 text-secondary">Já recebido</h6></div>
              <div class="card-body"><h4 data-count="${paid}">${S.money(paid)}</h4></div>
            </div>
          </div>
          <div class="col-12 col-md-4 my-2 page-animate">
            <div class="card kpi-card h-100">
              <div class="card-header"><h6 class="m-0 text-secondary">Próximo depósito</h6></div>
              <div class="card-body">
                <h4 data-count="${next?.net || 0}">${S.money(next?.net || 0)}</h4>
                <small>${next ? next.date.split("-").reverse().join("/") : "—"}</small>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4 my-2 page-animate">
            <div class="card kpi-card h-100">
              <div class="card-header"><h6 class="m-0 text-secondary">Antecipação</h6></div>
              <div class="card-body">
                <p class="small mb-3">Receba o ciclo agendado agora, com taxa extra de 2%.</p>
                <button class="btn btn-primary w-100" data-advance ${next ? "" : "disabled"}>Antecipar ${next ? S.money(next.net * 0.98) : ""}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card anim-card page-animate mt-3">
          <div class="card-header"><h6 class="m-0">Agenda de repasses</h6></div>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead><tr><th>Período</th><th>Depósito</th><th>Bruto</th><th>Taxa iFood</th><th>Líquido</th><th>Status</th></tr></thead>
              <tbody>
                ${list
                  .map(
                    (p) => `
                  <tr>
                    <td>${p.period}</td>
                    <td>${p.date.split("-").reverse().join("/")}</td>
                    <td>${S.money(p.gross)}</td>
                    <td>${S.money(p.fee)}</td>
                    <td>${S.money(p.net)}</td>
                    <td><span class="status-pill ${statusClass(p.status)}">${p.status}</span></td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  };

  const renderCardapio = () => {
    const items = S.menu();
    view.innerHTML = `
      <div class="container-fluid pb-4">
        <div class="d-flex justify-content-between align-items-center mt-3 page-animate">
          <p class="text-body-tertiary m-0">Itens ativos no iFood e no salão. Pause o que estiver em falta.</p>
          <button class="btn btn-primary" data-product-new>Novo item</button>
        </div>
        <div class="row mt-2">
          ${items
            .map(
              (item) => `
            <div class="col-12 col-sm-6 col-xl-4 my-2 page-animate">
              <div class="card pay-card h-100 ${item.available ? "" : "opacity-75"}">
                <div class="card-header d-flex justify-content-between">
                  <span class="badge text-bg-light">${item.category}</span>
                  <span class="status-pill ${item.available ? "ok" : "no"}">${item.available ? "Disponível" : "Pausado"}</span>
                </div>
                <div class="card-body">
                  <h5>${item.name}</h5>
                  <p class="display-6 fs-4 text-primary mb-1">${S.money(item.price)}</p>
                  <small class="text-body-tertiary">${item.sold} vendas no mês</small>
                </div>
                <div class="card-footer d-flex gap-2">
                  <button class="btn btn-sm ${item.available ? "btn-outline-danger" : "btn-primary"} flex-fill" data-toggle-item="${item.id}">
                    ${item.available ? "Pausar" : "Ativar"}
                  </button>
                </div>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>`;
  };

  const productForm = () => `
    <h5 class="mb-3">Novo item</h5>
    <form id="product-form" class="row g-3">
      <div class="col-12"><label class="form-label">Nome</label><input required class="form-control" name="name"></div>
      <div class="col-6"><label class="form-label">Categoria</label>
        <select class="form-select" name="category"><option>Lanches</option><option>Combos</option><option>Acompanhamentos</option><option>Bebidas</option><option>Sobremesas</option></select>
      </div>
      <div class="col-6"><label class="form-label">Preço</label><input required type="number" min="1" step="0.01" class="form-control" name="price"></div>
      <div class="col-12 d-flex gap-2 justify-content-end">
        <button type="button" class="btn btn-light" data-close-modal>Cancelar</button>
        <button class="btn btn-primary" type="submit">Salvar</button>
      </div>
    </form>`;

  const podium = (list, unit) => {
    const [first, second, third, ...rest] = list.concat(Array(10).fill({ name: "—", count: 0 })).slice(0, 10);
    const col = (item, place, color, h) => `
      <div class="podium-col">
        <img src="./public/images/${place === 1 ? "coroa-ouro" : place === 2 ? "coroa-prata" : "coroa-vermelha"}.svg" alt="">
        <div style="width:84px;height:84px;border-radius:48px;background:#F9F2E8;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <h3 class="numeroPedidosRanking" style="color:${color}">${item.count}</h3>
          <p class="textoPedidos m-0" style="color:${color}">${unit}</p>
        </div>
        <p class="posicaoText"><span>${place}°</span> ${item.name}</p>
        <div class="podium-bar" style="height:${h}px;background:${color === "#664D03" ? "#FFC107" : color === "#6C757D" ? "#DEE2E6" : "#FFE5EB"}"></div>
      </div>`;
    return `
      <div class="ranking-podium">${col(second, 2, "#6C757D", 72)}${col(first, 1, "#664D03", 118)}${col(third, 3, "#DC3545", 46)}</div>
      <div class="outrasPosicoes mt-3">
        ${[first, second, third, ...rest]
          .slice(3)
          .map(
            (item, i) => `
          <div class="divCelulaOutrasPosicoes">
            <div class="divCelulaPosicao">${i + 4}°</div>
            <div class="divCelulaNome">${item.name}</div>
            <div class="divCelulaPedidos">${item.count}</div>
          </div>`
          )
          .join("")}
      </div>`;
  };

  const renderAnalises = () => {
    const orders = S.orders().filter((o) => o.status === "Concluído");
    const clients = rank(orders, "customer");
    const riders = rank(orders, "delivery");
    const foods = productRank(orders);
    view.innerHTML = `
      <section class="container-fluid py-4">
        <h5 class="page-animate">Ranking dos 10 melhores</h5>
        <div class="divPrincipalCards">
          ${[
            ["Clientes mais frequentes", clients, "Pedidos"],
            ["Melhores entregadores", riders, "Entregas"],
            ["Queridinhos dos clientes", foods, "Pedidos"],
          ]
            .map(
              ([title, list, unit]) => `
            <div class="containerCardsRanking page-animate anim-card">
              <div class="firstDivCardsRanking"><h6 class="text-secondary m-0">${title}</h6></div>
              ${podium(list, unit)}
            </div>`
            )
            .join("")}
        </div>
      </section>`;
    if (window.gsap && !reduceMotion) gsap.from(".podium-bar", { scaleY: 0, duration: 0.7, stagger: 0.05, ease: "back.out(1.4)" });
  };

  const renderSeguranca = () => {
    const users = S.users();
    view.innerHTML = `
      <section>
        <div class="firstDivSecurity page-animate">
          <div class="input-group mb-3" style="max-width:320px">
            <input type="text" class="form-control" id="user-search" placeholder="Buscar">
            <button class="btn btn-primary" type="button"><icon-set imageUrl="./public/icons/icon-search.svg"></icon-set></button>
          </div>
          <button class="btn btn-primary" data-user-new>Novo usuário</button>
        </div>
        <div class="divPessoasSecurity page-animate">
          <div class="table-responsive w-100">
            <table class="tabela w-100">
              <thead><tr><th>Nome</th><th>Email</th><th>Cargo</th><th>Permissão</th><th class="text-center">Ações</th></tr></thead>
              <tbody id="users-body"></tbody>
            </table>
          </div>
        </div>
      </section>`;

    const paint = (q = "") => {
      const rows = users.filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q.toLowerCase()));
      document.getElementById("users-body").innerHTML = rows
        .map(
          (u) => `
          <tr>
            <td class="tdNome">${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role || "—"}</td>
            <td>${u.permission || "Usuário"}</td>
            <td class="text-center">
              <button class="btn" data-user-edit="${u.id}" aria-label="Editar"><icon-set imageUrl="./public/icons/icon-pencil.svg"></icon-set></button>
              <button class="btn" data-user-del="${u.id}" aria-label="Excluir"><icon-set imageUrl="./public/icons/icon-trash.svg"></icon-set></button>
            </td>
          </tr>`
        )
        .join("");
    };
    paint();
    document.getElementById("user-search").addEventListener("input", (e) => paint(e.target.value));
  };

  const userForm = (user = {}) => `
    <h5 class="mb-3">${user.id ? "Editar usuário" : "Novo usuário"}</h5>
    <form id="user-form" class="row g-3">
      <input type="hidden" name="id" value="${user.id || ""}">
      <div class="col-12"><label class="form-label">Nome</label><input required class="form-control" name="name" value="${user.name || ""}"></div>
      <div class="col-12"><label class="form-label">E-mail</label><input required type="email" class="form-control" name="email" value="${user.email || ""}"></div>
      <div class="col-6"><label class="form-label">Cargo</label><input class="form-control" name="role" value="${user.role || ""}"></div>
      <div class="col-6"><label class="form-label">Permissão</label>
        <select class="form-select" name="permission">
          ${["Administrador", "Moderador", "Usuário"].map((p) => `<option ${user.permission === p ? "selected" : ""}>${p}</option>`).join("")}
        </select>
      </div>
      <div class="col-12"><label class="form-label">Senha ${user.id ? "(opcional)" : ""}</label><input class="form-control" name="password" type="password" ${user.id ? "" : "required"} minlength="8"></div>
      <div class="col-12 d-flex gap-2 justify-content-end">
        <button type="button" class="btn btn-light" data-close-modal>Cancelar</button>
        <button class="btn btn-primary" type="submit">Salvar</button>
      </div>
    </form>`;

  const renderMensagens = () => {
    const threads = S.threads();
    const current = threads.find((t) => t.id === activeThread) || threads[0];
    activeThread = current?.id;
    view.innerHTML = `
      <div class="container-fluid h-100 px-0">
        <div class="message-structure h-100">
          <aside class="message-list">
            <div id="collapseAside" class="nav nav-message border-end flex-column ${window.innerWidth < 768 ? "" : "show"}">
              ${threads
                .map(
                  (t) => `
                <a class="nav-link ${t.id === activeThread ? "active" : ""}" href="#" data-thread="${t.id}">
                  <div class="rounded-pills p-i me-3">
                    <img src="./public/images/image-placeholder.png" width="40" class="object-fit-cover border rounded-pill" alt="">
                  </div>
                  <div class="flex-fill pe-2 overflow-hidden">
                    <h6 class="name pe-2">${t.name}</h6>
                    <small class="text-body-tertiary">${t.preview}</small>
                  </div>
                  ${t.unread ? `<div class="badge bg-primary">${t.unread}</div>` : ""}
                </a>`
                )
                .join("")}
            </div>
          </aside>
          <div class="tab-content tab-content-message">
            <div class="tab-pane fade show active" style="display:grid;grid-template-rows:auto 1fr auto;height:100%">
              <header class="message-header border-bottom">
                <div class="d-flex align-items-center px-3 py-3">
                  <button class="btn btn-collapse btn-primary d-md-none me-3 px-2" data-toggle-chat>
                    <icon-set imageUrl="./public/icons/icon-brand-messenger.svg"></icon-set>
                  </button>
                  <div class="rounded-pills p-i me-3">
                    <img src="./public/images/image-placeholder.png" width="40" class="object-fit-cover border rounded-pill" alt="">
                  </div>
                  <div class="flex-fill"><h6 class="mb-0">${current.name}<br><small class="text-body-tertiary">online</small></h6></div>
                </div>
              </header>
              <div class="message-body" id="chat-body">
                ${current.messages
                  .map(
                    (m) => `
                  <div class="message ${m.from === "me" ? "right" : "left"} p-2">
                    <div class="card card-message ${m.from === "me" ? "right" : ""} shadow">
                      <div class="card-header text-primary">${m.from === "me" ? session.name : current.name}</div>
                      <div class="card-body">${m.text}</div>
                      <div class="card-footer"><small class="text-body-tertiary">${m.at}</small></div>
                    </div>
                  </div>`
                  )
                  .join("")}
              </div>
              <footer class="message-footer shadow-lg border-top p-2">
                <textarea class="form-control rounded-4" id="chat-input" rows="1" placeholder="Escreva sua mensagem aqui..."></textarea>
                <button class="btn btn-primary mx-2 px-2 rounded-pill" id="chat-send">
                  <icon-set imageUrl="./public/icons/icon-send.svg"></icon-set>
                </button>
              </footer>
            </div>
          </div>
        </div>
      </div>`;
    const body = document.getElementById("chat-body");
    body.scrollTop = body.scrollHeight;
  };

  const sendMessage = () => {
    const input = document.getElementById("chat-input");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    const threads = S.threads();
    const thread = threads.find((t) => t.id === activeThread);
    thread.messages.push({ id: S.uid("m"), from: "me", text, at: "Agora" });
    thread.preview = text;
    thread.unread = 0;
    S.saveThreads(threads);
    input.value = "";
    renderMensagens();
    animateView();
    updateBadges();
  };

  const render = () => {
    const route = (location.hash.replace("#/", "") || "inicio").split("?")[0];
    const known = titles[route] ? route : "inicio";
    killCharts();
    closeSidebar();
    closeModal();
    setActiveNav(known);
    if (known === "inicio") renderHome();
    else if (known === "gestao") renderGestao();
    else if (known === "repasses") renderRepasses();
    else if (known === "cardapio") renderCardapio();
    else if (known === "analises") renderAnalises();
    else if (known === "seguranca") renderSeguranca();
    else renderMensagens();
    updateBadges();
    animateView();
  };

  document.body.addEventListener("click", (event) => {
    const go = event.target.closest("[data-go]");
    if (go) {
      event.preventDefault();
      location.hash = `#/${go.dataset.go}`;
      return;
    }
    if (event.target.closest("[data-toggle-sidebar]")) {
      toggleSidebar();
      return;
    }
    if (event.target === backdrop) closeSidebar();
    if (event.target.closest("[data-open='notices']")) {
      event.preventDefault();
      renderNotices();
      return;
    }
    if (event.target.closest("[data-close-modal]") || event.target === modalLayer) {
      closeModal();
      return;
    }
    const read = event.target.closest("[data-read]");
    if (read) {
      const notices = S.notices().map((n) => (n.id === read.dataset.read ? { ...n, unread: false } : n));
      S.saveNotices(notices);
      updateBadges();
      renderNotices();
      return;
    }
    const st = event.target.closest("[data-status]");
    if (st) {
      const [id, status] = st.dataset.status.split(":");
      S.saveOrders(S.orders().map((o) => (o.id === id ? { ...o, status } : o)));
      toast(`Pedido ${status.toLowerCase()}.`);
      render();
      return;
    }
    if (event.target.closest("[data-advance]")) {
      const list = S.payouts();
      const next = list.find((p) => p.status === "Agendado");
      if (!next) return;
      next.status = "Antecipado";
      next.fee = Number((next.fee + next.net * 0.02).toFixed(2));
      next.net = Number((next.net * 0.98).toFixed(2));
      S.savePayouts(list);
      toast("Repasse antecipado para a conta iFood Pago.");
      render();
      return;
    }
    if (event.target.closest("[data-product-new]")) {
      openModal(productForm());
      return;
    }
    const toggleItem = event.target.closest("[data-toggle-item]");
    if (toggleItem) {
      S.saveMenu(
        S.menu().map((item) => (item.id === toggleItem.dataset.toggleItem ? { ...item, available: !item.available } : item))
      );
      toast("Cardápio atualizado.");
      render();
      return;
    }
    if (event.target.closest("[data-user-new]")) {
      openModal(userForm());
      return;
    }
    const edit = event.target.closest("[data-user-edit]");
    if (edit) {
      openModal(userForm(S.users().find((u) => u.id === edit.dataset.userEdit)));
      return;
    }
    const del = event.target.closest("[data-user-del]");
    if (del) {
      if (!confirm("Excluir este usuário?")) return;
      S.saveUsers(S.users().filter((u) => u.id !== del.dataset.userDel));
      toast("Usuário removido.");
      render();
      return;
    }
    const thread = event.target.closest("[data-thread]");
    if (thread) {
      event.preventDefault();
      const threads = S.threads().map((t) => (t.id === thread.dataset.thread ? { ...t, unread: 0 } : t));
      S.saveThreads(threads);
      activeThread = thread.dataset.thread;
      renderMensagens();
      updateBadges();
      return;
    }
    if (event.target.closest("[data-toggle-chat]")) {
      document.getElementById("collapseAside")?.classList.toggle("show");
    }
    if (event.target.closest("#chat-send")) sendMessage();
    if (event.target.closest("[data-logout]")) {
      S.logout();
      location.href = "./login.html";
    }
  });

  modalLayer.addEventListener("submit", (event) => {
    if (event.target.id === "product-form") {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      S.saveMenu([{ id: S.uid("m"), name: data.name, category: data.category, price: Number(data.price), available: true, sold: 0 }, ...S.menu()]);
      toast("Item adicionado ao cardápio.");
      closeModal();
      render();
      return;
    }
    if (event.target.id !== "user-form") return;
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const users = S.users();
    if (data.id) {
      S.saveUsers(
        users.map((u) =>
          u.id === data.id
            ? { ...u, name: data.name, email: data.email, role: data.role, permission: data.permission, password: data.password || u.password }
            : u
        )
      );
      toast("Usuário atualizado.");
    } else {
      S.saveUsers([...users, { id: S.uid("u"), ...data }]);
      toast("Usuário criado.");
    }
    closeModal();
    render();
  });

  document.body.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.id === "chat-input" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  window.addEventListener("hashchange", render);
  render();
})();
