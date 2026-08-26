(() => {
  const KEYS = {
    users: "icare.users",
    session: "icare.session",
    orders: "icare.orders",
    threads: "icare.threads",
    notices: "icare.notices",
  };

  const DEMO = {
    email: "rafael@icare.finance",
    password: "ifood2024",
  };

  const seedUsers = () => [
    {
      id: "u-rafael",
      name: "Rafael Rangel",
      email: DEMO.email,
      password: DEMO.password,
      role: "Administrador",
      permission: "Administrador",
      birth: "1998-04-12",
      gender: "Masculino",
      cpf: "281.104.000-23",
      cnpj: "12.345.678/0001-90",
    },
    {
      id: "u-ana",
      name: "Ana Pereira",
      email: "ana.pereira@email.com",
      password: "12345678",
      role: "Coordenadora",
      permission: "Moderador",
    },
    {
      id: "u-carlos",
      name: "Carlos Andrade",
      email: "carlos.andrade@email.com",
      password: "12345678",
      role: "Analista",
      permission: "Usuário",
    },
    {
      id: "u-bea",
      name: "Beatriz Souza",
      email: "beatriz.souza@email.com",
      password: "12345678",
      role: "Desenvolvedora",
      permission: "Administrador",
    },
    {
      id: "u-lucas",
      name: "Lucas Almeida",
      email: "lucas.almeida@email.com",
      password: "12345678",
      role: "Suporte",
      permission: "Usuário",
    },
    {
      id: "u-mari",
      name: "Mariana Costa",
      email: "mariana.costa@email.com",
      password: "12345678",
      role: "Gerente",
      permission: "Administrador",
    },
  ];

  const seedOrders = () => [
    { id: "p1", customer: "Lucas Ferreira", items: "Hambúrguer, Fritas, Coca-Cola", payment: "Débito", value: 45.9, date: "2026-08-20", time: "12:30", status: "Concluído", delivery: "João da Silva" },
    { id: "p2", customer: "Mariana Souza", items: "Cheeseburguer, Salada, Suco", payment: "Pix", value: 38.5, date: "2026-08-20", time: "13:15", status: "Concluído", delivery: "Carolina Pereira" },
    { id: "p3", customer: "João Carlos", items: "Hambúrguer Duplo, Salada, Água", payment: "Crédito", value: 50, date: "2026-08-21", time: "14:00", status: "Concluído", delivery: "João da Silva" },
    { id: "p4", customer: "Beatriz Oliveira", items: "Hambúrguer Vegano, Batata Doce, Refrigerante", payment: "Dinheiro", value: 42, date: "2026-08-21", time: "15:45", status: "Concluído", delivery: "Victor João" },
    { id: "p5", customer: "Pedro Henrique", items: "Hambúrguer de Frango, Fritas, Chá Gelado", payment: "Débito", value: 39.9, date: "2026-08-22", time: "16:30", status: "Concluído", delivery: "João da Silva" },
    { id: "p6", customer: "Ana Clara", items: "Hambúrguer Clássico, Salada, Água com Gás", payment: "Pix", value: 36.5, date: "2026-08-22", time: "17:10", status: "Concluído", delivery: "Carolina Pereira" },
    { id: "p7", customer: "Felipe Martins", items: "Hambúrguer, Salada, Coca-Cola Zero", payment: "Crédito", value: 40, date: "2026-08-23", time: "18:00", status: "Concluído", delivery: "João da Silva" },
    { id: "p8", customer: "Lucas Silva", items: "Cheeseburguer, Fritas, Coca-Cola", payment: "Crédito", value: 45.9, date: "2026-08-23", time: "12:05", status: "Concluído", delivery: "João da Silva" },
    { id: "p9", customer: "Mariana Souza", items: "Hambúrguer Vegano, Batata Doce, Suco Natural", payment: "Débito", value: 38.5, date: "2026-08-24", time: "13:40", status: "Concluído", delivery: "Carolina Pereira" },
    { id: "p10", customer: "João Almeida", items: "Hambúrguer Duplo, Onion Rings, Água", payment: "Pix", value: 50, date: "2026-08-24", time: "14:20", status: "Pendente", delivery: "Victor João" },
    { id: "p11", customer: "Pedro Henrique", items: "Hambúrguer de Frango, Fritas, Chá Gelado", payment: "Dinheiro", value: 42, date: "2026-08-25", time: "15:10", status: "Cancelado", delivery: "Camila Rocha" },
    { id: "p12", customer: "Ana Clara", items: "Cheeseburguer, Milkshake, Salada", payment: "Crédito", value: 48.75, date: "2026-08-25", time: "16:45", status: "Concluído", delivery: "João da Silva" },
    { id: "p13", customer: "Carolina Pereira", items: "Super Bacon Burger, Fritas", payment: "Pix", value: 52.9, date: "2026-08-25", time: "19:20", status: "Concluído", delivery: "João da Silva" },
    { id: "p14", customer: "Lucas Ferreira", items: "Super Bacon Burger, Refrigerante", payment: "Crédito", value: 47.0, date: "2026-08-26", time: "11:10", status: "Concluído", delivery: "Carolina Pereira" },
    { id: "p15", customer: "Victor João", items: "Hambúrguer Clássico, Fritas", payment: "Dinheiro", value: 33.9, date: "2026-08-26", time: "12:00", status: "Pendente", delivery: "Diego Alves" },
    { id: "p16", customer: "Ana Clara", items: "Açaí 500ml, Leite condensado", payment: "Pix", value: 24.9, date: "2026-08-26", time: "13:05", status: "Concluído", delivery: "João da Silva" },
    { id: "p17", customer: "João Carlos", items: "Super Bacon Burger, Onion Rings, Coca-Cola", payment: "Débito", value: 61.5, date: "2026-08-26", time: "13:50", status: "Concluído", delivery: "Carolina Pereira" },
    { id: "p18", customer: "Beatriz Oliveira", items: "Hambúrguer Vegano, Suco", payment: "Pix", value: 34.0, date: "2026-08-26", time: "15:00", status: "Cancelado", delivery: "Victor João" },
    { id: "p19", customer: "Felipe Martins", items: "Cheeseburguer, Fritas", payment: "Crédito", value: 41.2, date: "2026-08-19", time: "20:15", status: "Concluído", delivery: "Diego Alves" },
    { id: "p20", customer: "Mariana Souza", items: "Super Bacon Burger, Milkshake", payment: "Pix", value: 55.4, date: "2026-08-18", time: "21:00", status: "Concluído", delivery: "João da Silva" },
  ];

  const seedThreads = () => [
    {
      id: "t1",
      name: "Victor Hugo",
      preview: "O pedido 1024 saiu para entrega.",
      unread: 2,
      messages: [
        { id: "m1", from: "them", text: "Oi, o cliente perguntou sobre o tempo de entrega.", at: "Há 2 dias" },
        { id: "m2", from: "them", text: "É o pedido do Hambúrguer Duplo.", at: "Há 2 dias" },
        { id: "m3", from: "me", text: "Pode avisar que sai em 10 minutos.", at: "Há 1 dia" },
        { id: "m4", from: "them", text: "O pedido 1024 saiu para entrega.", at: "Há 2 min" },
        { id: "m5", from: "me", text: "Perfeito, obrigado!", at: "Há 1 min" },
      ],
    },
    {
      id: "t2",
      name: "Carol Carolina",
      preview: "Consegue liberar o PIX do almoço?",
      unread: 0,
      messages: [
        { id: "m6", from: "them", text: "Consegue liberar o PIX do almoço?", at: "Há 2 min" },
        { id: "m7", from: "me", text: "Já confirmei no painel.", at: "Há 1 min" },
      ],
    },
    {
      id: "t3",
      name: "Suporte iFood",
      preview: "Sua loja superou a média da região.",
      unread: 1,
      messages: [
        { id: "m8", from: "them", text: "Sua loja superou a média da região esta semana. Parabéns!", at: "Há 40 min" },
      ],
    },
  ];

  const seedNotices = () => [
    { id: "n1", title: "Atingiu sua meta!", text: "A partir de hoje você já superou as médias do mês passado. Parabéns!", image: "./public/images/not-flag.png", unread: true },
    { id: "n2", title: "Novidades!", text: "Agora você pode inserir vários usuários e dar permissão para cada um.", image: "./public/images/not-user.png", unread: true },
    { id: "n3", title: "Cuidado!", text: "Tivemos uma sequência de baixa nos pedidos. Podemos ajudar com algumas dicas.", image: "./public/images/not-bell-warning.png", unread: false },
  ];

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const ensure = () => {
    if (!localStorage.getItem(KEYS.users)) write(KEYS.users, seedUsers());
    if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, seedOrders());
    if (!localStorage.getItem(KEYS.threads)) write(KEYS.threads, seedThreads());
    if (!localStorage.getItem(KEYS.notices)) write(KEYS.notices, seedNotices());
  };

  ensure();

  const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  window.IcareStore = {
    DEMO,
    money(value) {
      return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    },
    users() {
      return read(KEYS.users, []);
    },
    saveUsers(list) {
      write(KEYS.users, list);
    },
    orders() {
      return read(KEYS.orders, []);
    },
    saveOrders(list) {
      write(KEYS.orders, list);
    },
    threads() {
      return read(KEYS.threads, []);
    },
    saveThreads(list) {
      write(KEYS.threads, list);
    },
    notices() {
      return read(KEYS.notices, []);
    },
    saveNotices(list) {
      write(KEYS.notices, list);
    },
    session() {
      return read(KEYS.session, null);
    },
    login(email, password) {
      const user = this.users().find(
        (item) => item.email.toLowerCase() === String(email).trim().toLowerCase() && item.password === password
      );
      if (!user) return { ok: false, error: "E-mail ou senha inválidos." };
      const session = { id: user.id, name: user.name, email: user.email, role: user.permission || user.role };
      write(KEYS.session, session);
      return { ok: true, session };
    },
    logout() {
      localStorage.removeItem(KEYS.session);
    },
    register(payload) {
      const users = this.users();
      if (users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase())) {
        return { ok: false, error: "Este e-mail já está cadastrado." };
      }
      const user = { id: uid("u"), permission: "Usuário", ...payload };
      users.push(user);
      this.saveUsers(users);
      return { ok: true, user };
    },
    requireAuth() {
      const session = this.session();
      if (!session) {
        location.href = "./login.html";
        return null;
      }
      return session;
    },
    uid,
  };
})();
