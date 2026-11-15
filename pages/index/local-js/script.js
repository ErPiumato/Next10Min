const t = document.getElementById("testo"),
    b = document.getElementById("invia"),
    s = document.getElementById("stato"),
    c = document.getElementById("conta");

function aggiorna() {
    c.textContent = 200 - t.value.length;
    b.disabled = !t.value.trim();
}

function stato(msg, errore) {
    s.textContent = msg;
    s.className = errore ? "errore" : "";
}

async function invia() {
    const testo = t.value.trim();
    if (!testo) return;
    b.disabled = true;
    try {
        const r = await fetch(SUPABASE_URL + "/rest/v1/messaggi", {
            method: "POST",
            headers: {
                apikey: SUPABASE_KEY,
                "Content-Type": "application/json",
                Prefer: "return=minimal"
            },
            body: JSON.stringify({ testo })
        });
        if (!r.ok) throw new Error(r.status);
        t.value = "";
        stato("Inviato. Puoi scriverne un altro.");
    } catch (e) {
        stato("Invio non riuscito. Controlla la connessione e riprova.", true);
    }
    aggiorna();
    t.focus();
}

t.addEventListener("input", () => { stato(""); aggiorna(); });
t.addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) invia();
});
b.addEventListener("click", invia);
aggiorna();