// =====================================================
// roulette.js
// Part 1/4
// Kitty Meal Planner Ultimate
// =====================================================

let allFoods = [];

document.addEventListener("DOMContentLoaded", async () => {

    await loadFoods();

    const spinButton = document.getElementById("spinButton");

    if(spinButton){

        spinButton.addEventListener("click", spinRoulette);

    }

});


// =====================================================
// LOAD FOODS
// =====================================================

async function loadFoods(){

    const result = document.getElementById("rouletteResult");

    const { data, error } = await supabaseClient
        .from("foods")
        .select("*")
        .order("name",{ascending:true});

    if(error){

        console.log(error);

        result.innerHTML = `
            <div class="empty-card">

                โหลดข้อมูลอาหารไม่สำเร็จ

            </div>
        `;

        return;

    }

    allFoods = data;

    if(allFoods.length===0){

        result.innerHTML = `
            <div class="empty-card">

                ยังไม่มีเมนูอาหารใน Food Library

            </div>
        `;

    }

}


// =====================================================
// SPIN PLACEHOLDER
// =====================================================

function spinRoulette(){

    if(allFoods.length===0){

        alert("ยังไม่มีเมนูอาหาร");

        return;

    }

}
// =====================================================
// SPIN ROULETTE
// Part 2/4
// =====================================================

function spinRoulette(){

    if(allFoods.length===0){

        alert("ยังไม่มีเมนูอาหาร");

        return;

    }

    const randomIndex =
        Math.floor(Math.random() * allFoods.length);

    const food = allFoods[randomIndex];

    renderResult(food);

}


// =====================================================
// RENDER RESULT
// =====================================================

function renderResult(food){

    const result = document.getElementById("rouletteResult");

    const image =
        food.image_url ||
        "https://placehold.co/600x400/png?text=🍱+Food";

    result.innerHTML = `

        <div class="food-card">

            <img
                src="${image}"
                class="food-image"
            >

            <div class="food-content">

                <div class="food-title">

                    🎉 ${food.name}

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

}
// =====================================================
// ROULETTE ANIMATION
// Part 3/4
// =====================================================

let isSpinning = false;


// =====================================================
// OVERRIDE SPIN
// =====================================================

const originalSpinRoulette = spinRoulette;

spinRoulette = function(){

    if(isSpinning){

        return;

    }

    if(allFoods.length===0){

        alert("ยังไม่มีเมนูอาหาร");

        return;

    }

    isSpinning = true;

    const button =
        document.getElementById("spinButton");

    button.disabled = true;

    button.innerHTML = "🎲 กำลังสุ่ม...";


    let count = 0;

    const interval = setInterval(()=>{

        const random =
            allFoods[
                Math.floor(
                    Math.random()*allFoods.length
                )
            ];

        renderResult(random);

        count++;

    },100);


    setTimeout(()=>{

        clearInterval(interval);

        originalSpinRoulette();

        button.disabled = false;

        button.innerHTML = "🎡 Spin";

        isSpinning = false;

    },2500);

}
// =====================================================
// roulette.js
// Part 4/4
// Kitty Meal Planner Ultimate
// =====================================================


// =====================================================
// SPIN FAVORITE ONLY
// =====================================================

function spinFavorite(){

    const favorites = allFoods.filter(food => food.favorite);

    if(favorites.length===0){

        alert("ยังไม่มีเมนู Favorite");

        return;

    }

    const random =
        favorites[
            Math.floor(Math.random()*favorites.length)
        ];

    renderResult(random);

}


// =====================================================
// ADD TO PLANNER
// =====================================================

async function addToPlanner(foodId){

    const today =
        new Date().toISOString().split("T")[0];

    const { error } = await supabaseClient
        .from("meal_plans")
        .insert([
    {
        plan_date: today,
        meal_type: "Dinner",
        food_id: foodId
    }
]);

    if(error){

        alert(error.message);

        console.log(error);

        return;

    }

    alert("✅ เพิ่มลง Planner แล้ว");

}


// =====================================================
// OVERRIDE RESULT
// =====================================================

const originalRenderResult = renderResult;

renderResult = function(food){

    originalRenderResult(food);

    const result =
        document.getElementById("rouletteResult");

    result.innerHTML += `

        <div
            style="
                margin-top:20px;
                display:flex;
                gap:12px;
                justify-content:center;
                flex-wrap:wrap;
            ">

            <button
                onclick="spinRoulette()">

                🎡 สุ่มใหม่

            </button>

            <button
                onclick="spinFavorite()">

                ❤️ Favorite

            </button>

            <button
                onclick="addToPlanner('${food.id}')">

                ➕ เพิ่มเข้า Planner

            </button>

        </div>

    `;

}


// =====================================================
// END OF FILE
// =====================================================
