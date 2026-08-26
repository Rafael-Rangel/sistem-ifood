(() => {
  const KEYS = {
    users: "icare.users",
    session: "icare.session",
    orders: "icare.orders",
    threads: "icare.threads",
    notices: "icare.notices",
    menu: "icare.menu",
    payouts: "icare.payouts",
    version: "icare.dataVersion",
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
    { id: "p21", customer: "Helena Dias", items: "Combo Família, 2 Coca-Cola", payment: "Pix", value: 89.9, date: "2026-08-26", time: "18:20", status: "Concluído", delivery: "João da Silva" },
    { id: "p22", customer: "Ricardo Alves", items: "Hambúrguer Duplo, Fritas, Milkshake", payment: "Crédito", value: 67.5, date: "2026-08-26", time: "18:45", status: "Pendente", delivery: "Carolina Pereira" },
    { id: "p23", customer: "Sofia Lima", items: "Açaí 700ml, Granola, Banana", payment: "Pix", value: 32.0, date: "2026-08-26", time: "19:05", status: "Concluído", delivery: "Diego Alves" },
    { id: "p24", customer: "Bruno Castro", items: "Super Bacon Burger, Onion Rings, Coca-Cola", payment: "Débito", value: 58.9, date: "2026-08-26", time: "19:30", status: "Em preparo", delivery: "João da Silva" },
    { id: "p25", customer: "Larissa Nunes", items: "Hambúrguer Vegano, Suco Natural", payment: "Dinheiro", value: 36.0, date: "2026-08-25", time: "12:40", status: "Concluído", delivery: "Victor João" },
    { id: "p26", customer: "Thiago Melo", items: "Cheeseburguer, Fritas, Refrigerante", payment: "Pix", value: 44.5, date: "2026-08-24", time: "20:10", status: "Concluído", delivery: "Camila Rocha" },
    { id: "p27", customer: "Paula Ribeiro", items: "Combo Família", payment: "Crédito", value: 92.0, date: "2026-08-23", time: "21:00", status: "Concluído", delivery: "João da Silva" },
    { id: "p28", customer: "Caio Pinto", items: "Hambúrguer de Frango, Chá Gelado", payment: "Pix", value: 41.9, date: "2026-08-22", time: "11:25", status: "Concluído", delivery: "Carolina Pereira" },
  ];

  const seedMenu = () => [
    { id: "m1", name: "Super Bacon Burger", category: "Lanches", price: 42.9, available: true, sold: 234 },
    { id: "m2", name: "Hambúrguer Duplo", category: "Lanches", price: 38.5, available: true, sold: 132 },
    { id: "m3", name: "Hambúrguer Vegano", category: "Lanches", price: 34.0, available: true, sold: 87 },
    { id: "m4", name: "Cheeseburguer", category: "Lanches", price: 29.9, available: true, sold: 156 },
    { id: "m5", name: "Combo Família", category: "Combos", price: 89.9, available: true, sold: 64 },
    { id: "m6", name: "Fritas", category: "Acompanhamentos", price: 14.9, available: true, sold: 198 },
    { id: "m7", name: "Onion Rings", category: "Acompanhamentos", price: 16.9, available: true, sold: 91 },
    { id: "m8", name: "Açaí 500ml", category: "Sobremesas", price: 24.9, available: true, sold: 73 },
    { id: "m9", name: "Milkshake", category: "Bebidas", price: 18.5, available: false, sold: 48 },
    { id: "m10", name: "Coca-Cola", category: "Bebidas", price: 8.0, available: true, sold: 210 },
  ];

  const seedPayouts = () => [
    { id: "r1", period: "11/08 a 17/08", date: "2026-08-19", gross: 4280.4, fee: 513.65, net: 3766.75, status: "Pago" },
    { id: "r2", period: "18/08 a 24/08", date: "2026-08-26", gross: 3912.8, fee: 469.54, net: 3443.26, status: "Pago" },
    { id: "r3", period: "25/08 a 31/08", date: "2026-09-02", gross: 1860.55, fee: 223.27, net: 1637.28, status: "Agendado" },
    { id: "r4", period: "01/09 a 07/09", date: "2026-09-09", gross: 0, fee: 0, net: 0, status: "Aberto" },
  ];

  const seedThreads = () => [
    {
      id: "t1",
      name: "João da Silva",
      role: "Entregador iFood",
      color: "#EA0033",
      online: true,
      time: "19:32",
      preview: "Tô no portão do 204, cliente já desceu.",
      unread: 2,
      messages: [
        { id: "m1a", from: "them", text: "Boa tarde. Já estou na área, posso pegar o almoço?", at: "12:04", day: "Ontem" },
        { id: "m1b", from: "me", text: "Pode sim. Pedido 27 da Paula está no balcão, saco térmico.", at: "12:05", day: "Ontem" },
        { id: "m1c", from: "them", text: "Entregue. Cliente deu 5 estrelas.", at: "12:28", day: "Ontem" },
        { id: "m1", from: "them", text: "Cheguei na loja. Super Bacon do Bruno tá pronto?", at: "18:40", day: "Hoje" },
        { id: "m2", from: "me", text: "Sai em 4 minutos. Já embalamos o refrigerante.", at: "18:41", day: "Hoje" },
        { id: "m3", from: "them", text: "Beleza. Rota: Copacabana → Ipanema, 2 paradas.", at: "18:42", day: "Hoje" },
        { id: "m4", from: "them", text: "Cliente do 204 pediu para ligar no interfone 32.", at: "19:28", day: "Hoje" },
        { id: "m5", from: "me", text: "Anotado. Pode confirmar a entrega no app depois.", at: "19:29", day: "Hoje" },
        { id: "m6", from: "them", text: "Tô no portão do 204, cliente já desceu.", at: "19:32", day: "Hoje" },
      ],
    },
    {
      id: "t2",
      name: "Carolina Pereira",
      role: "Entregadora iFood",
      color: "#0d6efd",
      online: true,
      time: "19:18",
      preview: "Chuva forte na Niemeyer, atraso de 8 min.",
      unread: 1,
      messages: [
        { id: "m7a", from: "them", text: "O Combo Família cabe na bag? São 2 sacolas.", at: "18:12", day: "Hoje" },
        { id: "m7", from: "me", text: "Cabe sim. Combo da Helena saiu. Código IF-8821.", at: "18:15", day: "Hoje" },
        { id: "m8", from: "them", text: "Peguei. GPS marcou 12 minutos.", at: "18:16", day: "Hoje" },
        { id: "m8b", from: "me", text: "Se atrasar, avisa que mandamos cupom de 10%.", at: "18:17", day: "Hoje" },
        { id: "m9", from: "them", text: "Chuva forte na Niemeyer, atraso de 8 min.", at: "19:18", day: "Hoje" },
      ],
    },
    {
      id: "t3",
      name: "Suporte iFood",
      role: "Parceiro",
      color: "#EA0033",
      online: true,
      time: "17:05",
      preview: "Seu ticket de taxa foi protocolado.",
      unread: 1,
      messages: [
        { id: "m10", from: "them", text: "Olá, Rafael. Identificamos 2 cancelamentos acima da média da região nesta semana.", at: "11:20", day: "Ontem" },
        { id: "m11", from: "me", text: "Foi falta de motoboy no almoço. Já reforçamos a escala.", at: "11:34", day: "Ontem" },
        { id: "m11b", from: "them", text: "Obrigado pelo retorno. Vamos acompanhar o índice nas próximas 48h.", at: "11:41", day: "Ontem" },
        { id: "m12", from: "them", text: "Perfeito. Sua loja superou a média da região no jantar. Parabéns!", at: "14:10", day: "Hoje" },
        { id: "m12b", from: "me", text: "Dá para revisar a taxa de 12% do último ciclo? Tivemos promoção.", at: "14:22", day: "Hoje" },
        { id: "m13", from: "them", text: "Seu ticket de taxa foi protocolado. Retorno em até 24h no iFood Pago.", at: "17:05", day: "Hoje" },
      ],
    },
    {
      id: "t4",
      name: "iFood Pago",
      role: "Financeiro",
      color: "#198754",
      online: false,
      time: "16:40",
      preview: "Repasse de 26/08 já caiu na conta.",
      unread: 0,
      messages: [
        { id: "m14", from: "them", text: "Repasse 18/08 a 24/08: R$ 3.443,26 disponível.", at: "09:02", day: "Ontem" },
        { id: "m15", from: "me", text: "Pode confirmar se a antecipação de 2% já está habilitada?", at: "09:18", day: "Ontem" },
        { id: "m16", from: "them", text: "Sim. Você antecipa o ciclo atual pelo menu Repasses.", at: "09:21", day: "Ontem" },
        { id: "m16b", from: "me", text: "Fechado. Vou antecipar só se o caixa apertar no sábado.", at: "09:24", day: "Ontem" },
        { id: "m17", from: "them", text: "Repasse de 26/08 já caiu na conta.", at: "16:40", day: "Hoje" },
      ],
    },
    {
      id: "t5",
      name: "Mariana Souza",
      role: "Cliente",
      color: "#6f42c1",
      online: false,
      time: "13:12",
      preview: "Pode tirar a cebola do Super Bacon, por favor?",
      unread: 0,
      messages: [
        { id: "m18", from: "them", text: "Oi! Fiz o pedido 14, Super Bacon + refrigerante.", at: "11:02", day: "Hoje" },
        { id: "m19", from: "me", text: "Recebemos, Mariana. Previsão 35 minutos.", at: "11:03", day: "Hoje" },
        { id: "m19b", from: "them", text: "Pode deixar sem maionese também?", at: "11:04", day: "Hoje" },
        { id: "m19c", from: "me", text: "Pode. Já ajustamos o pedido na cozinha.", at: "11:05", day: "Hoje" },
        { id: "m20", from: "them", text: "Pode tirar a cebola do Super Bacon, por favor?", at: "13:12", day: "Hoje" },
        { id: "m21", from: "me", text: "Já avisamos a cozinha. Sem cebola no seu lanche.", at: "13:13", day: "Hoje" },
      ],
    },
    {
      id: "t6",
      name: "Diego Alves",
      role: "Entregador iFood",
      color: "#fd7e14",
      online: true,
      time: "12:08",
      preview: "Açaí da Sofia entregue, foto no app.",
      unread: 0,
      messages: [
        { id: "m22", from: "me", text: "Açaí 700ml da Sofia Lima saiu gelado. Cuidado no transporte.", at: "11:50", day: "Hoje" },
        { id: "m23", from: "them", text: "Peguei com isopor. 6 minutos de rota.", at: "11:51", day: "Hoje" },
        { id: "m23b", from: "me", text: "Perfeito. Se o prédio pedir documento, é apto 804.", at: "11:52", day: "Hoje" },
        { id: "m24", from: "them", text: "Açaí da Sofia entregue, foto no app.", at: "12:08", day: "Hoje" },
      ],
    },
    {
      id: "t7",
      name: "Ana Clara",
      role: "Cliente",
      color: "#d63384",
      online: false,
      time: "Ontem",
      preview: "O suco veio sem gelo, mas obrigada!",
      unread: 0,
      messages: [
        { id: "m25", from: "them", text: "Meu vegano chegou. Dá para mandar um molho extra na próxima?", at: "12:55", day: "Ontem" },
        { id: "m26", from: "me", text: "Claro. Anotamos no seu cadastro para os próximos pedidos.", at: "12:58", day: "Ontem" },
        { id: "m27", from: "them", text: "O suco veio sem gelo, mas obrigada!", at: "13:10", day: "Ontem" },
        { id: "m27b", from: "me", text: "Desculpa pelo gelo. Na próxima vai com cubos à parte.", at: "13:12", day: "Ontem" },
      ],
    },
    {
      id: "t8",
      name: "Victor João",
      role: "Entregador iFood",
      color: "#20c997",
      online: false,
      time: "15:08",
      preview: "Cliente cancelou na porta. Volto com o vegano.",
      unread: 0,
      messages: [
        { id: "m28", from: "me", text: "Pedido 18 da Beatriz: vegano + suco. PIX já confirmado.", at: "14:48", day: "Hoje" },
        { id: "m29", from: "them", text: "Saindo agora. Interfone não atende.", at: "15:02", day: "Hoje" },
        { id: "m30", from: "them", text: "Cliente cancelou na porta. Volto com o vegano.", at: "15:08", day: "Hoje" },
        { id: "m31", from: "me", text: "Ok. Deixa na loja que a gente registra o cancelamento.", at: "15:09", day: "Hoje" },
      ],
    },
    {
      id: "t9",
      name: "Camila Rocha",
      role: "Entregadora iFood",
      color: "#6610f2",
      online: true,
      time: "20:10",
      preview: "Cheeseburguer do Thiago entregue.",
      unread: 0,
      messages: [
        { id: "m32", from: "them", text: "Cheguei para o 26, Cheeseburguer do Thiago.", at: "19:52", day: "Ontem" },
        { id: "m33", from: "me", text: "Pode buscar. Sacola amarela no balcão 2.", at: "19:53", day: "Ontem" },
        { id: "m34", from: "them", text: "Cheeseburguer do Thiago entregue.", at: "20:10", day: "Ontem" },
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
    if (!localStorage.getItem(KEYS.menu)) write(KEYS.menu, seedMenu());
    if (!localStorage.getItem(KEYS.payouts)) write(KEYS.payouts, seedPayouts());
    if (localStorage.getItem(KEYS.version) !== "4") {
      const current = read(KEYS.orders, []);
      const ids = new Set(current.map((item) => item.id));
      write(KEYS.orders, current.concat(seedOrders().filter((item) => !ids.has(item.id))));
      if (!localStorage.getItem(KEYS.menu)) write(KEYS.menu, seedMenu());
      if (!localStorage.getItem(KEYS.payouts)) write(KEYS.payouts, seedPayouts());
      write(KEYS.threads, seedThreads());
      write(KEYS.version, "4");
    }
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
    menu() {
      return read(KEYS.menu, seedMenu());
    },
    saveMenu(list) {
      write(KEYS.menu, list);
    },
    payouts() {
      return read(KEYS.payouts, seedPayouts());
    },
    savePayouts(list) {
      write(KEYS.payouts, list);
    },
    session() {
      return read(KEYS.session, null);
    },
    login(email) {
      const clean = String(email || "exemplo@gmail.com").trim() || "exemplo@gmail.com";
      const found = this.users().find((item) => item.email.toLowerCase() === clean.toLowerCase());
      const session = {
        id: found?.id || "guest",
        name: found?.name || "Rafael Rangel",
        email: clean,
        role: found?.permission || found?.role || "Administrador",
      };
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
