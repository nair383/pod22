document.addEventListener("DOMContentLoaded", () => {
    
    /* ===================================================
       1. CANVAS DE PARTÍCULAS INTERACTIVAS (Fondo dinámico)
       =================================================== */
    if (window.innerWidth >= 320) {
        const canvas = document.createElement("canvas");
        canvas.id = "particle-canvas";
        document.body.prepend(canvas);

        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        let particles = [];
        // Menos partículas en móvil (15) que en PC (45) para cuidar el rendimiento
        const particleCount = window.innerWidth < 768 ? 15 : 45;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5 * 0.5);
                this.vy = (Math.random() - 0.5 * 0.5);
                this.radius = Math.random() * 2 + 0.8;
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
                ctx.fillStyle = `rgba(0, 71, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Distancia más corta para conectar líneas en móviles
        const maxLinkDistance = window.innerWidth < 768 ? 70 : 140;

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
                        ctx.strokeStyle = `rgba(0, 71, 255, ${opacity})`;
                        ctx.lineWidth = 0.8;
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
       2. MENÚ RESPONSIVO MÓVIL
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
       4. WIDGET: COTIZADOR Y ESTIMADOR (Con opción "Otro" y WhatsApp)
       =================================================== */
    const calcModalidad = document.getElementById("calcModalidad");
    const calcServicio = document.getElementById("calcServicio");
    const calcOtroBox = document.getElementById("calcOtroBox");
    const calcInputOtro = document.getElementById("calcInputOtro");

    function calcularEstimacion() {
        const modalidad = calcModalidad?.value;
        const servicio = calcServicio?.value;
        const priceElement = document.getElementById("calcPrice");
        const noteElement = document.getElementById("calcNote");
        const whatsappLink = document.getElementById("calcWhatsappLink");

        if (!modalidad || !servicio || !priceElement || !whatsappLink) return;

        let modalidadText = modalidad === "consulta" ? "Atención en Consulta (Ñuñoa)" : "Atención a Domicilio";
        let servicioText = "";
        let noteText = "";

        if (calcOtroBox) {
            if (servicio === "otro") {
                calcOtroBox.style.display = "block";
            } else {
                calcOtroBox.style.display = "none";
            }
        }

        switch (servicio) {
            case "preventiva":
                servicioText = "Podología Clínica Preventiva / Mantención";
                noteText = "Evaluación, perfilado ungueal y humectación integral.";
                break;
            case "encarnada":
                servicioText = "Uña Encarnada (Tratamiento de Urgencia)";
                noteText = "Desencarnación técnica, curación e instrumental esterilizado.";
                break;
            case "hongos":
                servicioText = "Tratamiento de Hongos (Onicomicosis)";
                noteText = "Fresado ungueal y protocolo antiséptico específico.";
                break;
            case "diabetico":
                servicioText = "Atención Pie Diabético / Adulto Mayor";
                noteText = "Atención de alto resguardo con instrumental 100% esterilizado.";
                break;
            case "otro":
                const detalleExtra = calcInputOtro && calcInputOtro.value.trim() !== "" ? calcInputOtro.value.trim() : "No especificado";
                servicioText = `Otro: ${detalleExtra}`;
                noteText = "Atención personalizada según requerimiento específico.";
                break;
        }

        priceElement.textContent = `${servicioText} (${modalidadText})`;
        if (noteElement) noteElement.textContent = noteText;

        const mensajeCotizador = `Hola Podología VivA, me interesa cotizar y agendar la siguiente atención:\n\n- Servicio: ${servicioText}\n- Modalidad: ${modalidadText}`;
        whatsappLink.href = `https://wa.me/56949819428?text=${encodeURIComponent(mensajeCotizador)}`;
    }

    if (calcModalidad && calcServicio) {
        calcModalidad.addEventListener("change", calcularEstimacion);
        calcServicio.addEventListener("change", calcularEstimacion);
        if (calcInputOtro) {
            calcInputOtro.addEventListener("input", calcularEstimacion);
        }
        calcularEstimacion();
    }

    /* ===================================================
       5. ASISTENTE INTERACTIVO DE CITAS (SMART WIZARD WSP)
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
        let motivoSeleccionado = "";
        let modalidadSeleccionada = "";

        function actualizarEnlaceWhatsApp() {
            let textoMotivo = "";
            let textoModalidad = "";

            switch (motivoSeleccionado) {
                case "dolor":
                    textoMotivo = "Tengo dolor / Uña encarnada (Urgencia)";
                    break;
                case "preventiva":
                    textoMotivo = "Evaluación general / Limpieza preventiva";
                    break;
                case "adulto_mayor":
                    textoMotivo = "Necesito atención para Adulto Mayor / Domicilio";
                    break;
                case "otro":
                    textoMotivo = inputOtroDetalle ? inputOtroDetalle.value.trim() : "Otro motivo";
                    break;
            }

            if (motivoSeleccionado === "otro") {
                textoModalidad = "No especificada / Consulta general";
            } else {
                textoModalidad = modalidadSeleccionada === "domicilio" ? "A Domicilio" : "En Consulta (Ñuñoa)";
                if (modalidadSeleccionada === "domicilio" && inputDireccion && inputDireccion.value.trim() !== "") {
                    textoModalidad += ` (Dirección: ${inputDireccion.value.trim()})`;
                }
            }

            const mensaje = `Hola Podología VivA, necesito agendar una atención con los siguientes detalles:\n\n- Motivo: ${textoMotivo}\n- Modalidad: ${textoModalidad}`;
            const urlWsp = `https://wa.me/56949819428?text=${encodeURIComponent(mensaje)}`;
            
            btnSmartBooking.href = urlWsp;
        }

        motivoBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                motivoBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                motivoSeleccionado = btn.getAttribute("data-motivo");
                modalidadBtns.forEach(b => b.classList.remove("active"));
                modalidadSeleccionada = "";

                if (motivoSeleccionado === "otro") {
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

                modalidadSeleccionada = btn.getAttribute("data-modalidad");

                if (modalidadSeleccionada === "domicilio") {
                    if (stepDireccion) stepDireccion.style.display = "block";
                } else {
                    if (stepDireccion) stepDireccion.style.display = "none";
                }

                if (stepBoton) stepBoton.style.display = "block";
                actualizarEnlaceWhatsApp();
            });
        });

        if (inputOtroDetalle) {
            inputOtroDetalle.addEventListener("input", actualizarEnlaceWhatsApp);
        }

        if (inputDireccion) {
            inputDireccion.addEventListener("input", actualizarEnlaceWhatsApp);
        }
    }
});

/* ===================================================
   LÓGICA DEL CHATBOT VIVIANA (SUPABASE)
   =================================================== */
const SUPABASE_CHAT_URL = 'https://ydskauniiggmkkdrlzcl.supabase.co/functions/v1/chat';

const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
const chatbotModal = document.getElementById('chatbot-modal');
const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');
const chatbotBadge = document.querySelector('.chatbot-badge-unread');

if (chatbotToggleBtn && chatbotModal) {
    chatbotToggleBtn.addEventListener('click', () => {
        chatbotModal.classList.toggle('hidden');
        if (chatbotBadge) chatbotBadge.style.display = 'none';
    });

    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', () => {
            chatbotModal.classList.add('hidden');
        });
    }

    function appendMessage(text, isUser = false) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`;
        bubble.innerHTML = text.replace(/\n/g, '<br>');
        chatbotMessages.appendChild(bubble);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function sendMessage() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        appendMessage(text, true);
        chatbotInput.value = '';

        const loadingBubble = document.createElement('div');
        loadingBubble.className = 'chat-bubble bot-bubble';
        loadingBubble.innerText = 'Viviana está escribiendo...';
        chatbotMessages.appendChild(loadingBubble);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        try {
            const response = await fetch(SUPABASE_CHAT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            chatbotMessages.removeChild(loadingBubble);

            if (data.reply) {
                appendMessage(data.reply, false);
            } else {
                appendMessage('Disculpa, en este momento no pude procesar tu mensaje. Puedes agendar directamente por WhatsApp.');
            }
        } catch (error) {
            if (loadingBubble.parentNode) chatbotMessages.removeChild(loadingBubble);
            appendMessage('Tuve un problema de conexión. Por favor intenta de nuevo.');
        }
    }

    if (chatbotSendBtn) chatbotSendBtn.addEventListener('click', sendMessage);
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}