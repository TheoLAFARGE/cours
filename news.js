var NEWS_API_KEY = "5db555e4-15f6-4693-a499-35a4c993c1ad";

function loadNews() {
    var container = document.getElementById("newsContainer");
    container.innerHTML = "<p style='text-align:center;opacity:0.7'>Chargement des news...</p>";

    fetch("https://fortnite-api.com/v2/news?language=fr", {
        headers: {
            "Authorization": NEWS_API_KEY
        }
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Erreur API : " + response.status);
            }
            return response.json();
        })
        .then(function (json) {
            var motds = json.data.br.motds;
            container.innerHTML = "";

            motds.forEach(function (news) {
                if (news.hidden) return;

                var card = document.createElement("div");
                card.className = "news-card";
                card.innerHTML =
                    '<img class="news-image" src="' + news.tileImage + '" alt="' + news.title + '">' +
                    '<div class="news-content">' +
                    '<h3 class="news-title">' + news.title + '</h3>' +
                    '<p class="news-body">' + news.body + '</p>' +
                    '</div>';
                container.appendChild(card);
            });
        })
        .catch(function (err) {
            console.error("Erreur lors du chargement des news :", err);
            container.innerHTML = "<p style='text-align:center;color:#ff6b6b'>Impossible de charger les news</p>";
        });
}

loadNews();
