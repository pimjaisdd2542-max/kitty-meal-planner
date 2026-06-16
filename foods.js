let allFoods = [];

document.addEventListener("DOMContentLoaded", async () => {

    await loadFoods();

    const search =
        document.getElementById("searchFood");

    if(search){
        search.addEventListener(
            "input",
            filterFoods
        );
    }

});

async function loadFoods(){

    const foodsDiv =
        document.getElementById("foods");

    const { data, error } =
        await supabaseClient
        .from("foods")
        .select("*")
        .order("created_at",{ascending:false});

    if(error){

        foodsDiv.innerHTML =
            `<p>${error.message}</p>`;

        return;
    }

    allFoods = data || [];

    renderFoods(allFoods);
}

function renderFoods(data){

    const foodsDiv =
        document.getElementById("foods");

    let html =
        `<div class="food-grid">`;

    data.forEach(food=>{

        const image =
            food.image_url
            ? food.image_url
            : "https://placehold.co/600x400/png?text=Food";

        html += `
        <div class="food-card">

            <img
                src="${image}"
                class="food-image">

            <div class="food-content">

                <div class="food-title">
                    ${food.name}
                </div>

                <div class="food-info">
                    🔥 ${food.calories || 0} kcal
                </div>

                <div class="food-info">
                    💪 ${food.protein || 0} g
                </div>

                <div class="food-info">
                    🍞 ${food.carb || 0} g
                </div>

                <div class="food-info">
                    🥑 ${food.fat || 0} g
                </div>

                <button
                    class="favorite-btn"
                    onclick="toggleFavorite(${food.id}, ${food.favorite})">

                    ${food.favorite ? "❤️ Favorite" : "🤍 Favorite"}

                </button>

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

    const filtered =
        allFoods.filter(food =>
            food.name
            .toLowerCase()
            .includes(keyword)
        );

    renderFoods(filtered);
}

async function toggleFavorite(id,current){

    await supabaseClient
        .from("foods")
        .update({
            favorite: !current
        })
        .eq("id",id);

    loadFoods();
}

async function addFood(){

    const file =
        document
        .getElementById("foodImage")
        .files[0];

    let imageUrl = null;

    if(file){

        const fileName =
            `${Date.now()}-${file.name}`;

        const upload =
            await supabaseClient
            .storage
            .from("food-images")
            .upload(
                fileName,
                file
            );

        if(!upload.error){

            const publicUrl =
                supabaseClient
                .storage
                .from("food-images")
                .getPublicUrl(fileName);

            imageUrl =
                publicUrl.data.publicUrl;
        }
    }

    const payload = {

        name:
            document
            .getElementById("foodName")
            .value,

        calories:
            Number(
                document
                .getElementById("foodCalories")
                .value || 0
            ),

        protein:
            Number(
                document
                .getElementById("foodProtein")
                .value || 0
            ),

        carb:
            Number(
                document
                .getElementById("foodCarb")
                .value || 0
            ),

        fat:
            Number(
                document
                .getElementById("foodFat")
                .value || 0
            ),

        category:
            document
            .getElementById("foodCategory")
            .value,

        meal_type:
            document
            .getElementById("foodMealType")
            .value,

        prep_time:
            document
            .getElementById("foodPrepTime")
            .value,

        difficulty:
            document
            .getElementById("foodDifficulty")
            .value,

        image_url:
            imageUrl

    };

    const result =
        await supabaseClient
        .from("foods")
        .insert(payload);

    if(result.error){

        alert(result.error.message);
        return;
    }

    alert("บันทึกสำเร็จ 🎀");

    location.reload();
}
