document.addEventListener("DOMContentLoaded", () => {
    
    /* ===================================================
       1. MENÚ RESPONSIVO MÓVIL
       =================================================== */
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navLinks.classList.toggle("active");
            
            const icon = menuToggle.querySelector("i");
            if (icon) {
                if (navLinks.classList.contains("active")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    /* ===================================================
       2. CANVAS DE PARTÍCULAS INTERACTIVAS (Optimizado móviles)
       =================================================== */
    if (window.innerWidth >= 576) {
        const canvas = document.createElement("canvas");
        canvas.id = "particle-canvas";
        document.body.prepend(canvas);

        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        let particles = [];
        const particleCount = window.innerWidth < 768 ? 20 : 40;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 168, 168, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const maxLinkDistance = window.innerWidth < 768 ? 90 : 130;

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxLinkDistance) {
                        const opacity = (1 - dist / maxLinkDistance) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 168, 168, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            drawConnections();
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    /* ===================================================
       3. WIDGET: FILTRADO DE SERVICIOS POR CATEGORÍA
       =================================================== */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const serviceItems = document.querySelectorAll(".service-item");

    if (filterButtons.length > 0 && serviceItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const filterValue = button.getAttribute("data-filter");

                serviceItems.forEach(item => {
                    const category = item.getAttribute("data-category");

                    if (filterValue === "all" || category === filterValue) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }

    /* ===================================================
       4. WIDGET: COTIZADOR Y CALCULADORA DINÁMICA
       =================================================== */
    const calcModalidad = document.getElementById("calcModalidad");
    const calcServicio = document.getElementById("calcServicio");

    function calcularEstimacion() {
        const modalidad = calcModalidad?.value;
        const servicio = calcServicio?.value;
        const priceElement = document.getElementById("calcPrice");
        const noteElement = document.getElementById("calcNote");
        const whatsappLink = document.getElementById("calcWhatsappLink");

        if (!modalidad || !servicio || !priceElement || !whatsappLink) return;

        let modalidadText = modalidad === "consulta" ? "Atención en Consulta Ñuñoa" : "Atención a Domicilio";
        let servicioText = "";
        let noteText = "";

        switch (servicio) {
            case "preventiva":
                servicioText = "Podología Preventiva";
                noteText = "Evaluación, perfilado ungueal y humectación integral.";
                break;
            case "encarnada":
                servicioText = "Uña Encarnada";
                noteText = "Desencarnación técnica, curación e instrumental esterilizado.";
                break;
            case "hongos":
                servicioText = "Tratamiento Hongos";
                noteText = "Fresado ungueal y protocolo antiséptico específico.";
                break;
            case "diabetico":
                servicioText = "Pie Diabético / Adulto Mayor";
                noteText = "Atención de alto resguardo con instrumental 100% esterilizado.";
                break;
        }

        priceElement.textContent = `${servicioText} (${modalidadText})`;
        if (noteElement) noteElement.textContent = noteText;

        const mensaje = encodeURIComponent(`Hola Podología VivA, quisiera agendar una ${servicioText} en modalidad ${modalidadText}.`);
        whatsappLink.href = `https://wa.me/56949819428?text=${mensaje}`;
    }

    if (calcModalidad && calcServicio) {
        calcModalidad.addEventListener("change", calcularEstimacion);
        calcServicio.addEventListener("change", calcularEstimacion);
        calcularEstimacion();
    }

    /* ===================================================
       5. ASISTENTE INTERACTIVO DE CITAS (SMART WIZARD)
       =================================================== */
    const motivoBtns = document.querySelectorAll("#motivoOptions .opt-btn");
    const modalidadBtns = document.querySelectorAll("#modalidadOptions .opt-btn");
    
    const stepModalidad = document.getElementById("stepModalidad");
    const stepOtroTexto = document.getElementById("stepOtroTexto");
    const stepDireccion = document.getElementById("stepDireccion");
    const stepBoton = document.getElementById("stepBoton");

    const inputOtroDetalle = document.getElementById("inputOtroDetalle");
    const inputDireccion = document.getElementById("inputDireccion");
    const btnSmartBooking = document.getElementById("btnSmartBooking");

    if (motivoBtns.length > 0 && btnSmartBooking) {
        let motivoCodigo = "";
        let motivoTexto = "";
        let modalidadCodigo = "";

        const mapaMotivos = {
            "dolor": "Tengo dolor / Uña encarnada (Urgencia)",
            "preventiva": "Evaluación general / Limpieza preventiva",
            "adulto_mayor": "Atención para Adulto Mayor"
        };

        const actualizarEnlaceWhatsApp = () => {
            let mensaje = "";

            if (motivoCodigo === "otro") {
                const detalle = inputOtroDetalle?.value.trim() || "consulta general";
                mensaje = `Hola Podología VivA, necesito una atención por ${detalle}`;
            } else {
                if (modalidadCodigo === "domicilio") {
                    const direccion = inputDireccion?.value.trim() || "[Dirección no ingresada]";
                    mensaje = `Hola Podología VivA, necesito una atención por ${motivoTexto} a domicilio en ${direccion}`;
                } else {
                    mensaje = `Hola Podología VivA, necesito una atención por ${motivoTexto} en Consulta (Ñuñoa)`;
                }
            }

            btnSmartBooking.href = `https://wa.me/56949819428?text=${encodeURIComponent(mensaje)}`;
        };

        motivoBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                motivoBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                motivoCodigo = btn.getAttribute("data-motivo");
                motivoTexto = mapaMotivos[motivoCodigo] || "";

                modalidadBtns.forEach(b => b.classList.remove("active"));
                modalidadCodigo = "";

                if (motivoCodigo === "otro") {
                    if (stepModalidad) stepModalidad.style.display = "none";
                    if (stepDireccion) stepDireccion.style.display = "none";
                    if (stepOtroTexto) stepOtroTexto.style.display = "block";
                    if (stepBoton) stepBoton.style.display = "block";
                } else {
                    if (stepOtroTexto) stepOtroTexto.style.display = "none";
                    if (stepModalidad) stepModalidad.style.display = "block";
                    if (stepDireccion) stepDireccion.style.display = "none";
                    if (stepBoton) stepBoton.style.display = "none";
                }

                actualizarEnlaceWhatsApp();
            });
        });

        modalidadBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                modalidadBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                modalidadCodigo = btn.getAttribute("data-modalidad");

                if (modalidadCodigo === "domicilio") {
                    if (stepDireccion) stepDireccion.style.display = "block";
                } else {
                    if (stepDireccion) stepDireccion.style.display = "none";
                }

                if (stepBoton) stepBoton.style.display = "block";
                actualizarEnlaceWhatsApp();
            });
        });

        inputOtroDetalle?.addEventListener("input", actualizarEnlaceWhatsApp);
        inputDireccion?.addEventListener("input", actualizarEnlaceWhatsApp);
    }
});