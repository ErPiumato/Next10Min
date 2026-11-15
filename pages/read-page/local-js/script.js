const m = document.getElementById("msg"), b = document.getElementById("pesca");

async function pesca() {
    b.disabled = true;
    try {
        const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/random_messaggio", {
            method: "POST",
            headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
            body: "{}"
        });
        if (!r.ok) throw new Error(r.status);
        const testo = await r.json();
        if (testo) {
            m.className = "";
            m.textContent = testo;
        } else {
            m.className = "vuoto";
            m.textContent = "Non ci sono ancora messaggi.";
        }
        b.textContent = "Pesca un altro";
    } catch (e) {
        m.className = "errore";
        m.textContent = "Lettura non riuscita. Riprova tra un attimo.";
    }
    b.disabled = false;
}

b.addEventListener("click", pesca);