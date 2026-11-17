const m = document.getElementById("msg"),
    b = document.getElementById("pesca"),
    e = document.getElementById("elimina"),
    H = { apikey: SUPABASE_KEY, "Content-Type": "application/json" };
let corrente = null, timer = null;

function resetElimina(mostra) {
    clearTimeout(timer);
    e.classList.remove("conferma");
    e.textContent = "Elimina questo messaggio";
    e.hidden = !mostra;
    e.disabled = false;
}

async function pesca() {
    b.disabled = true;
    corrente = null;
    resetElimina(false);
    try {
        const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/random_messaggio", {
            method: "POST", headers: H, body: "{}"
        });
        if (!r.ok) throw new Error(r.status);
        const riga = (await r.json())[0];
        if (riga) {
            corrente = riga.id;
            m.className = "";
            m.textContent = riga.testo;
            resetElimina(true);
        } else {
            m.className = "vuoto";
            m.textContent = "Non ci sono ancora messaggi.";
        }
        b.textContent = "Pesca un altro";
    } catch (err) {
        m.className = "errore";
        m.textContent = "Lettura non riuscita. Riprova tra un attimo.";
    }
    b.disabled = false;
}

async function elimina() {
    if (corrente === null) return;
    if (!e.classList.contains("conferma")) {
        e.classList.add("conferma");
        e.textContent = "Tocca di nuovo per eliminare";
        timer = setTimeout(() => resetElimina(true), 4000);
        return;
    }
    clearTimeout(timer);
    e.disabled = true;
    try {
        const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/elimina_messaggio", {
            method: "POST", headers: H, body: JSON.stringify({ p_id: corrente })
        });
        if (!r.ok) throw new Error(r.status);
        corrente = null;
        m.className = "vuoto";
        m.textContent = "Messaggio eliminato.";
        resetElimina(false);
    } catch (err) {
        resetElimina(true);
        e.textContent = "Eliminazione non riuscita. Riprova.";
    }
}

b.addEventListener("click", pesca);
e.addEventListener("click", elimina);