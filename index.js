var API_KEY = "5db555e4-15f6-4693-a499-35a4c993c1ad";

function formatNumber(n) {
    if (n == null) return "N/A";
    return n.toLocaleString("fr-FR");
}

function updateMode(prefix, modeData) {
    if (!modeData) {
        document.getElementById(prefix + "Wins").textContent = "N/A";
        document.getElementById(prefix + "Kills").textContent = "N/A";
        document.getElementById(prefix + "KD").textContent = "N/A";
        document.getElementById(prefix + "Matches").textContent = "N/A";
        document.getElementById(prefix + "WinRate").textContent = "N/A";
        return;
    }
    document.getElementById(prefix + "Wins").textContent = formatNumber(modeData.wins);
    document.getElementById(prefix + "Kills").textContent = formatNumber(modeData.kills);
    document.getElementById(prefix + "KD").textContent = modeData.kd != null ? modeData.kd.toFixed(2) : "N/A";
    document.getElementById(prefix + "Matches").textContent = formatNumber(modeData.matches);
    document.getElementById(prefix + "WinRate").textContent = modeData.winRate != null ? modeData.winRate.toFixed(2) + "%" : "N/A";
}

function loadStats(playerName) {
    if (!playerName.trim()) return;

    document.getElementById("playerName").textContent = "Chargement...";

    var url = "https://fortnite-api.com/v2/stats/br/v2?name=" + encodeURIComponent(playerName);

    fetch(url, {
        headers: {
            "Authorization": API_KEY
        }
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Erreur API : " + response.status);
            }
            return response.json();
        })
        .then(function (json) {
            var data = json.data;

            document.getElementById("playerName").textContent = data.account.name;

            if (data.battlePass) {
                document.getElementById("bpLevel").textContent = data.battlePass.level;
                document.getElementById("bpProgress").textContent = data.battlePass.progress;
            } else {
                document.getElementById("bpLevel").textContent = "N/A";
                document.getElementById("bpProgress").textContent = "N/A";
            }

            var overall = data.stats.all.overall;
            if (overall) {
                document.getElementById("totalWins").textContent = formatNumber(overall.wins);
                document.getElementById("totalKills").textContent = formatNumber(overall.kills);
                document.getElementById("kdRatio").textContent = overall.kd != null ? overall.kd.toFixed(2) : "N/A";
                document.getElementById("winRate").textContent = overall.winRate != null ? overall.winRate.toFixed(2) + "%" : "N/A";
            }

            updateMode("solo", data.stats.all.solo);
            updateMode("duo", data.stats.all.duo);
            updateMode("squad", data.stats.all.squad);
            updateMode("ltm", data.stats.all.ltm);
        })
        .catch(function (err) {
            console.error("Erreur lors du chargement des stats :", err);
            document.getElementById("playerName").textContent = "Joueur introuvable";
        });
}

// Recherche au clic
document.getElementById("searchBtn").addEventListener("click", function () {
    loadStats(document.getElementById("searchInput").value);
});

// Recherche avec Entrée
document.getElementById("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        loadStats(this.value);
    }
});

// Charger les stats par défaut
loadStats("Jacky John");
