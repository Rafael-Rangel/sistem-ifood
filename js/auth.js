(() => {
  const S = window.IcareStore;
  if (S.session() && !location.pathname.endsWith("cadastro.html") && !location.search.includes("logout")) {
    location.replace("./index.html#/inicio");
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.gsap && !reduceMotion) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.55 } });
    tl.from(".auth-visual", { x: -40, opacity: 0 })
      .from(".auth-card", { y: 28, opacity: 0 }, "-=0.35")
      .from(".auth-card .stagger", { y: 16, opacity: 0, stagger: 0.08 }, "-=0.2");
  }

  const alertBox = document.getElementById("auth-alert");
  const showError = (msg) => {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.style.display = "block";
  };

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("floatingInput").value;
      const password = document.getElementById("floatingPassword").value;
      const result = S.login(email, password);
      if (!result.ok) {
        showError(result.error);
        if (window.gsap) gsap.fromTo(loginForm, { x: -8 }, { x: 0, duration: 0.35, ease: "elastic.out(1,0.5)" });
        return;
      }
      location.href = "./index.html#/inicio";
    });
  }

  const forgot = document.getElementById("forgot-link");
  if (forgot) {
    forgot.addEventListener("click", (event) => {
      event.preventDefault();
      showError("Recuperação enviada para o e-mail de demonstração rafael@icare.finance.");
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(registerForm).entries());
      if (data.password !== data.confirm) {
        showError("As senhas não conferem.");
        return;
      }
      if (data.password.length < 8) {
        showError("A senha precisa ter pelo menos 8 caracteres.");
        return;
      }
      const result = S.register({
        name: data.name,
        email: data.email,
        password: data.password,
        birth: data.birth,
        gender: data.gender,
        cpf: data.cpf,
        cnpj: data.cnpj,
        role: "Parceiro",
        permission: "Usuário",
      });
      if (!result.ok) {
        showError(result.error);
        return;
      }
      S.login(data.email, data.password);
      location.href = "./index.html#/inicio";
    });
  }
})();
