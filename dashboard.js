// =====================================================
// dashboard.js
// Part 1/4
// Kitty Meal Planner Ultimate
// =====================================================

let todayFoods = [];
let favoriteCount = 0;

document.addEventListener("DOMContentLoaded", async () => {

    await loadDashboard();

});


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard(){

    await loadTodayMeals();

    await loadFavoriteCount();

}


// =====================================================
// LOAD TODAY MEALS
// =====================================================

async function loadTodayMeals(){

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabaseClient
        .from("meal_plans")
        .select(`
            id,
            meal_type,
            foods(
                id,
                name,
                calories,
                protein,
                carb,
                fat,
                image_url
            )
        `)
        .eq("plan_date", today);

    if(error){

        console.log(error);

        return;

    }

    todayFoods = data;

    renderDashboard();

}


// =====================================================
// LOAD FAVORITE COUNT
// =====================================================

async function loadFavoriteCount(){

    const { count, error } = await supabaseClient
        .from("foods")
        .select("*",{

            count:"exact",
            head:true

        })
        .eq("favorite",true);

    if(error){

        console.log(error);

        return;

    }

    favoriteCount = count;

}
// =====================================================
// DASHBOARD SUMMARY
// =====================================================

function renderDashboard(){

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarb = 0;
    let totalFat = 0;

    todayFoods.forEach(item=>{

        if(!item.foods) return;

        totalCalories += Number(item.foods.calories || 0);
        totalProtein += Number(item.foods.protein || 0);
        totalCarb += Number(item.foods.carb || 0);
        totalFat += Number(item.foods.fat || 0);

    });

    updateCard("todayCalories", totalCalories);
    updateCard("todayProtein", totalProtein.toFixed(1));
    updateCard("todayCarb", totalCarb.toFixed(1));
    updateCard("todayFat", totalFat.toFixed(1));
    updateCard("todayMeals", todayFoods.length);
    updateCard("favoriteFoods", favoriteCount);

    renderTodayMeals();

}


// =====================================================
// UPDATE CARD
// =====================================================

function updateCard(id,value){

    const card = document.getElementById(id);

    if(!card) return;

    card.textContent = value;

}


// =====================================================
// TODAY FOOD LIST
// =====================================================

function renderTodayMeals(){

    const div = document.getElementById("todayFoodList");

    if(!div) return;

    if(todayFoods.length===0){

        div.innerHTML=`
            <div class="empty-card">

                วันนี้ยังไม่มีเมนูอาหาร

            </div>
        `;

        return;

    }

    let html="";

    todayFoods.forEach(item=>{

        const food=item.foods;

        html+=`

        <div class="today-food-card">

            <img
                src="${food.image_url || 'https://placehold.co/80'}"
                class="today-food-image"
            >

            <div class="today-food-detail">

                <div class="today-food-title">

                    ${food.name}

                </div>

                <div>

                    🍽 ${item.meal_type}

                </div>

                <div>

                    🔥 ${food.calories || 0} kcal

                </div>

                <div>

                    💪 ${food.protein || 0} g Protein

                </div>

            </div>

        </div>

        `;

    });

    div.innerHTML = html;

}
// =====================================================
// DASHBOARD TARGET
// =====================================================

// หากยังไม่มีการตั้งค่า TDEE
// จะใช้ค่า Default ไปก่อน
const DEFAULT_CALORIES_GOAL = 1600;
const DEFAULT_PROTEIN_GOAL = 70;


// =====================================================
// CALCULATE PROGRESS
// =====================================================

function calculateProgress(totalCalories,totalProtein){

    let calorieGoal = DEFAULT_CALORIES_GOAL;
    let proteinGoal = DEFAULT_PROTEIN_GOAL;

    const caloriePercent =
        Math.min(
            Math.round((totalCalories/calorieGoal)*100),
            100
        );

    const proteinPercent =
        Math.min(
            Math.round((totalProtein/proteinGoal)*100),
            100
        );

    updateProgressBar(
        "calorieProgress",
        caloriePercent
    );

    updateProgressBar(
        "proteinProgress",
        proteinPercent
    );

    updateProgressText(
        totalCalories,
        calorieGoal,
        totalProtein,
        proteinGoal
    );

}


// =====================================================
// UPDATE PROGRESS BAR
// =====================================================

function updateProgressBar(id,percent){

    const bar=document.getElementById(id);

    if(!bar) return;

    bar.style.width=percent+"%";

    if(percent>=100){

        bar.style.background="#32c759";

    }
    else if(percent>=70){

        bar.style.background="#ff9500";

    }
    else{

        bar.style.background="#0A84FF";

    }

}


// =====================================================
// UPDATE PROGRESS TEXT
// =====================================================

function updateProgressText(
    calories,
    calorieGoal,
    protein,
    proteinGoal
){

    const calorieText=document.getElementById("calorieText");

    if(calorieText){

        calorieText.innerHTML=
        `${calories} / ${calorieGoal} kcal`;

    }

    const proteinText=document.getElementById("proteinText");

    if(proteinText){

        proteinText.innerHTML=
        `${protein.toFixed(1)} / ${proteinGoal} g`;

    }

}


// =====================================================
// DAILY STATUS
// =====================================================

function renderStatus(totalCalories,totalProtein){

    const status=document.getElementById("dailyStatus");

    if(!status) return;

    let message="";

    if(totalCalories===0){

        message="🍽 วันนี้ยังไม่มีการวางแผนอาหาร";

    }
    else if(totalProtein>=DEFAULT_PROTEIN_GOAL){

        message="💪 โปรตีนถึงเป้าหมายแล้ว เยี่ยมมาก!";

    }
    else{

        const remain=
            DEFAULT_PROTEIN_GOAL-totalProtein;

        message=
        `🥩 วันนี้ยังขาดโปรตีนอีก ${remain.toFixed(1)} g`;

    }

    status.innerHTML=message;

}


// =====================================================
// OVERRIDE DASHBOARD
// =====================================================

const originalRenderDashboard=renderDashboard;

renderDashboard=function(){

    originalRenderDashboard();

    let calories=0;
    let protein=0;

    todayFoods.forEach(item=>{

        if(!item.foods) return;

        calories+=Number(item.foods.calories||0);

        protein+=Number(item.foods.protein||0);

    });

    calculateProgress(
        calories,
        protein
    );

    renderStatus(
        calories,
        protein
    );

}
// =====================================================
// LOAD RECENT FAVORITES
// =====================================================

async function loadRecentFavorites(){

    const { data, error } = await supabaseClient
        .from("foods")
        .select("*")
        .eq("favorite", true)
        .order("created_at", { ascending:false })
        .limit(5);

    if(error){

        console.log(error);
        return;

    }

    renderFavoriteFoods(data);

}


// =====================================================
// RENDER FAVORITES
// =====================================================

function renderFavoriteFoods(data){

    const div = document.getElementById("favoriteFoodList");

    if(!div) return;

    if(data.length===0){

        div.innerHTML=`
            <div class="empty-card">
                ยังไม่มีเมนู Favorite
            </div>
        `;

        return;

    }

    let html="";

    data.forEach(food=>{

        html+=`

        <div class="favorite-card">

            <img
                src="${food.image_url || 'https://placehold.co/80'}"
                class="today-food-image"
            >

            <div class="today-food-detail">

                <div class="today-food-title">

                    ❤️ ${food.name}

                </div>

                <div>

                    🔥 ${food.calories || 0} kcal

                </div>

                <div>

                    💪 ${food.protein || 0} g

                </div>

            </div>

        </div>

        `;

    });

    div.innerHTML=html;

}


// =====================================================
// REFRESH DASHBOARD
// =====================================================

async function refreshDashboard(){

    await loadDashboard();

    await loadRecentFavorites();

}


// =====================================================
// AUTO REFRESH
// =====================================================

setInterval(async()=>{

    await refreshDashboard();

},60000);


// =====================================================
// INITIAL LOAD
// =====================================================

window.addEventListener("load",async()=>{

    await loadRecentFavorites();

});


// =====================================================
// FORMAT NUMBER
// =====================================================

function formatNumber(value){

    if(value===null) return 0;

    if(value===undefined) return 0;

    if(value==="") return 0;

    return Number(value);

}


// =====================================================
// FORMAT KCAL
// =====================================================

function formatCalories(value){

    return `${formatNumber(value)} kcal`;

}


// =====================================================
// FORMAT PROTEIN
// =====================================================

function formatProtein(value){

    return `${formatNumber(value).toFixed(1)} g`;

}


// =====================================================
// END OF FILE
// =====================================================
