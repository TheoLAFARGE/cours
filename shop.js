var SHOP_API_KEY = "5db555e4-15f6-4693-a499-35a4c993c1ad";

var RARITY_COLORS = {
    "legendary": "#f0a830",
    "epic": "#b44be0",
    "rare": "#3a9bf0",
    "uncommon": "#5eda3e",
    "common": "#b0b0b0"
};

function loadShop() {
    var container = document.getElementById("shopContainer");
    container.innerHTML = "<p style='text-align:center;opacity:0.7'>Chargement de la boutique...</p>";

    fetch("https://fortnite-api.com/v2/shop", {
        headers: {
            "Authorization": SHOP_API_KEY
        }
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Erreur API : " + response.status);
            }
            return response.json();
        })
        .then(function (json) {
            var entries = json.data.entries;
            container.innerHTML = "";

            // Filtrer les items avec réduction et calculer le pourcentage
            var discounted = [];
            entries.forEach(function (entry) {
                if (!entry.brItems || entry.brItems.length === 0) return;
                if (entry.regularPrice <= entry.finalPrice) return;

                var item = entry.brItems[0];
                var image = item.images.featured || item.images.icon || item.images.smallIcon;
                if (!image) return;

                var percent = Math.round((1 - entry.finalPrice / entry.regularPrice) * 100);
                discounted.push({ entry: entry, item: item, image: image, percent: percent });
            });

            // Trier du plus gros % au plus petit
            discounted.sort(function (a, b) {
                return b.percent - a.percent;
            });

            if (discounted.length === 0) {
                container.innerHTML = "<p style='text-align:center;opacity:0.7'>Aucune réduction disponible aujourd'hui</p>";
                return;
            }

            discounted.forEach(function (d) {
                var rarityName = d.item.rarity ? d.item.rarity.value.toLowerCase() : "common";
                var rarityColor = RARITY_COLORS[rarityName] || RARITY_COLORS["common"];
                var typeName = d.item.type ? d.item.type.displayValue : "";
                var priceText = d.entry.finalPrice.toLocaleString("fr-FR");
                var oldPrice = d.entry.regularPrice.toLocaleString("fr-FR");

                var card = document.createElement("div");
                card.className = "shop-card";
                card.style.borderColor = rarityColor;

                card.innerHTML =
                    '<div class="shop-card-badge">-' + d.percent + '%</div>' +
                    '<div class="shop-card-image" style="background-color:' + rarityColor + '20">' +
                    '<img src="' + d.image + '" alt="' + d.item.name + '">' +
                    '</div>' +
                    '<div class="shop-card-info">' +
                    '<span class="shop-card-type" style="color:' + rarityColor + '">' + typeName + '</span>' +
                    '<h3 class="shop-card-name">' + d.item.name + '</h3>' +
                    '<div class="shop-card-price">' +
                    '<span class="shop-card-old-price">' + oldPrice + '</span> ' +
                    '<span>' + priceText + ' V-Bucks</span>' +
                    '</div></div>';

                container.appendChild(card);
            });
        })
        .catch(function (err) {
            console.error("Erreur lors du chargement de la boutique :", err);
            container.innerHTML = "<p style='text-align:center;color:#ff6b6b'>Impossible de charger la boutique</p>";
        });
}

loadShop();
