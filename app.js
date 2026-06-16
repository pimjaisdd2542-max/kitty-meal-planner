let allFoods = [];

document.addEventListener("DOMContentLoaded", async () => {

    await loadFoods();

    const search = document.getElementById("searchFood");

    if(search){
        search.addEventListener("input", filterFoods);
    }

});

async function loadFoods(){

    const foodsDiv = document.getElementById("foods");

    if(!foodsDiv) return;

    const { data, error } = await supabaseClient
        .from("foods")
        .select("*")
        .order("created_at",{ascending:false});

    if(error){
        foodsDiv.innerHTML = `<p>${error.message}</p>`;
        return;
    }

    allFoods = data;

    renderFoods(allFoods);
}

function renderFoods(data){

    const foodsDiv = document.getElementById("foods");

    let html = `
        <div class="food-grid">
    `;

    data.forEach(food=>{

        const image = food.image_url
            ? food.image_url
            : "https://placehold.co/600x400/png?text=🍱+Food";

        html += `
            <div class="food-card">

                <img
                    src="${image}"
                    class="food-image"
                >

                <div class="food-content">

                    <div class="food-title">
                        ${food.name}
                    </div>

                    <div class="food-info">
                        🔥 ${food.calories || 0} kcal
                    </div>

                    <div class="food-info">
                        💪 ${food.protein || 0} g Protein
                    </div>

                    <div class="food-info">
                        🍞 ${food.carb || 0} g Carb
                    </div>

                    <div class="food-info">
                        🥑 ${food.fat || 0} g Fat
                    </div>

                    <div class="food-info">
                        📂 ${food.category || "-"}
                    </div>

                    <div class="favorite">
                        ${food.favorite ? "❤️ Favorite" : "🤍"}
                    </div>

                </div>

            </div>
        `;
    });

    html += `</div>`;

    foodsDiv.innerHTML = html;
}

function filterFoods(){

    const keyword =
        document
        .getElementById("searchFood")
        .value
        .toLowerCase();

    const filtered = allFoods.filter(food =>
        food.name.toLowerCase().includes(keyword)
    );

    renderFoods(filtered);
}
