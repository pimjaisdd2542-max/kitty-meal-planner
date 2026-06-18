// =====================================================
// planner.js
// Part 1/4
// Kitty Meal Planner Ultimate
// =====================================================

let allFoods = [];
let selectedDate = "";
let plannerData = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
};

// =====================================================
// START
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {

    const dateInput = document.getElementById("planDate");

    const today = new Date().toISOString().split("T")[0];

    dateInput.value = today;
    selectedDate = today;

    dateInput.addEventListener("change", async () => {

        selectedDate = this.value;

        await loadPlanner();

    });

    document
        .getElementById("searchFood")
        .addEventListener("input", filterFoods);

    document
        .getElementById("loadFoodsBtn")
        .addEventListener("click", loadFoods);

    await loadFoods();

    await loadPlanner();

});


// =====================================================
// LOAD FOOD LIBRARY
// =====================================================

async function loadFoods(){

    const foodList = document.getElementById("foodList");

    foodList.innerHTML = "Loading...";

    const {data,error} = await supabaseClient
        .from("foods")
        .select("*")
        .order("name");

    if(error){

        foodList.innerHTML = error.message;

        return;

    }

    allFoods = data;

    renderFoodList(allFoods);

}


// =====================================================
// RENDER FOOD LIST
// =====================================================

function renderFoodList(data){

    const foodList = document.getElementById("foodList");

    let html = "";

    data.forEach(food=>{

        html += `

        <div class="planner-food-card">

            <img
                src="${food.image_url || 'https://placehold.co/80'}"
                class="planner-food-image"
            >

            <div class="planner-food-detail">

                <div class="planner-food-title">

                    ${food.name}

                </div>

                <div>

                    🔥 ${food.calories || 0} kcal

                </div>

                <div>

                    💪 ${food.protein || 0} g

                </div>

            </div>

            <div class="planner-food-action">

                <button onclick="chooseMeal('${food.id}')">

                    ➕

                </button>

            </div>

        </div>

        `;

    });

    foodList.innerHTML = html;

}


// =====================================================
// SEARCH
// =====================================================

function filterFoods(){

    const keyword =
        document
        .getElementById("searchFood")
        .value
        .toLowerCase();

    const result = allFoods.filter(food=>{

        return food.name
            .toLowerCase()
            .includes(keyword);

    });

    renderFoodList(result);

}


// =====================================================
// SELECT MEAL TYPE
// =====================================================

function chooseMeal(foodId){

    const meal = prompt(

`เลือก Meal

1 = Breakfast
2 = Lunch
3 = Dinner
4 = Snack`

    );

    if(!meal) return;

    switch(meal){

        case "1":
            saveMeal(foodId,"Breakfast");
            break;

        case "2":
            saveMeal(foodId,"Lunch");
            break;

        case "3":
            saveMeal(foodId,"Dinner");
            break;

        case "4":
            saveMeal(foodId,"Snack");
            break;

        default:

            alert("เลือกไม่ถูกต้อง");

    }

}
// =====================================================
// SAVE MEAL PLAN
// =====================================================

async function saveMeal(foodId, mealType){

    const { error } = await supabaseClient
        .from("meal_plans")
        .insert({
            plan_date: selectedDate,
            meal_type: mealType,
            food_id: foodId
        });

    if(error){
        alert(error.message);
        return;
    }

    await loadPlanner();

}


// =====================================================
// LOAD PLANNER
// =====================================================

async function loadPlanner(){

    resetPlanner();

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
        .eq("plan_date", selectedDate);

    if(error){

        console.log(error);

        return;

    }

    data.forEach(item=>{

        const meal = item.meal_type.toLowerCase();

        if(meal==="breakfast"){

            plannerData.breakfast.push(item);

        }

        else if(meal==="lunch"){

            plannerData.lunch.push(item);

        }

        else if(meal==="dinner"){

            plannerData.dinner.push(item);

        }

        else if(meal==="snack"){

            plannerData.snack.push(item);

        }

    });

    renderPlanner();

}


// =====================================================
// RESET
// =====================================================

function resetPlanner(){

    plannerData = {

        breakfast:[],
        lunch:[],
        dinner:[],
        snack:[]

    };

}


// =====================================================
// RENDER
// =====================================================

function renderPlanner(){

    renderMealBlock(
        "breakfast",
        plannerData.breakfast
    );

    renderMealBlock(
        "lunch",
        plannerData.lunch
    );

    renderMealBlock(
        "dinner",
        plannerData.dinner
    );

    renderMealBlock(
        "snack",
        plannerData.snack
    );

    calculateSummary();

}


// =====================================================
// RENDER BLOCK
// =====================================================

function renderMealBlock(target,data){

    const div = document.getElementById(target);

    let html="";

    data.forEach(item=>{

        const food = item.foods;

        html+=`

        <div class="meal-item">

            <img
                src="${food.image_url || "https://placehold.co/60"}"
                class="meal-image"
            >

            <div class="meal-detail">

                <strong>

                    ${food.name}

                </strong>

                <br>

                🔥 ${food.calories || 0}

                kcal

            </div>

            <button
                class="delete-btn"
                onclick="deleteMeal(${item.id})">

                ✖

            </button>

        </div>

        `;

    });

    div.innerHTML = html;

}
// =====================================================
// CALCULATE DAILY SUMMARY
// =====================================================

function calculateSummary(){

    let totalCalories = 0;
    let totalProtein = 0;

    const meals = [
        ...plannerData.breakfast,
        ...plannerData.lunch,
        ...plannerData.dinner,
        ...plannerData.snack
    ];

    meals.forEach(item=>{

        if(!item.foods) return;

        totalCalories += Number(item.foods.calories || 0);
        totalProtein += Number(item.foods.protein || 0);

    });

    document.getElementById("totalCalories").textContent =
        totalCalories.toLocaleString();

    document.getElementById("totalProtein").textContent =
        totalProtein.toFixed(1);

}


// =====================================================
// DELETE MEAL
// =====================================================

async function deleteMeal(id){

    const confirmDelete = confirm(
        "ลบเมนูนี้ออกจาก Planner ?"
    );

    if(!confirmDelete) return;

    const { error } = await supabaseClient
        .from("meal_plans")
        .delete()
        .eq("id", id);

    if(error){

        alert(error.message);
        return;

    }

    await loadPlanner();

}


// =====================================================
// GET FOOD BY UUID
// =====================================================

function getFood(foodId){

    return allFoods.find(food=>food.id===foodId);

}


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
// CLEAR SEARCH
// =====================================================

function clearSearch(){

    const search = document.getElementById("searchFood");

    search.value = "";

    renderFoodList(allFoods);

}


// =====================================================
// REFRESH FOOD LIST
// =====================================================

async function refreshFoods(){

    await loadFoods();

}


// =====================================================
// REFRESH PLANNER
// =====================================================

async function refreshPlanner(){

    await loadPlanner();

}


// =====================================================
// TODAY BUTTON
// =====================================================

function goToday(){

    const today = new Date()
        .toISOString()
        .split("T")[0];

    selectedDate = today;

    document.getElementById("planDate").value = today;

    loadPlanner();

}


// =====================================================
// NEXT DAY
// =====================================================

function nextDay(){

    const date = new Date(selectedDate);

    date.setDate(date.getDate()+1);

    selectedDate =
        date.toISOString().split("T")[0];

    document.getElementById("planDate").value =
        selectedDate;

    loadPlanner();

}


// =====================================================
// PREVIOUS DAY
// =====================================================

function previousDay(){

    const date = new Date(selectedDate);

    date.setDate(date.getDate()-1);

    selectedDate =
        date.toISOString().split("T")[0];

    document.getElementById("planDate").value =
        selectedDate;

    loadPlanner();

}
// =====================================================
// EMPTY STATE
// =====================================================

function showEmptyMeal(target) {

    const div = document.getElementById(target);

    if (!div) return;

    if (div.innerHTML.trim() === "") {

        div.innerHTML = `
            <div class="meal-empty">
                ยังไม่มีเมนู
            </div>
        `;

    }

}


// =====================================================
// CHECK EMPTY BLOCK
// =====================================================

function updateEmptyState() {

    showEmptyMeal("breakfast");
    showEmptyMeal("lunch");
    showEmptyMeal("dinner");
    showEmptyMeal("snack");

}


// =====================================================
// LOADING
// =====================================================

function showLoading() {

    document.body.style.cursor = "wait";

}

function hideLoading() {

    document.body.style.cursor = "default";

}


// =====================================================
// RELOAD EVERYTHING
// =====================================================

async function reloadPlanner() {

    showLoading();

    await loadPlanner();

    hideLoading();

}


// =====================================================
// OVERRIDE LOADPLANNER
// =====================================================

const originalLoadPlanner = loadPlanner;

loadPlanner = async function () {

    await originalLoadPlanner();

    updateEmptyState();

};


// =====================================================
// OVERRIDE SAVE
// =====================================================

const originalSaveMeal = saveMeal;

saveMeal = async function (foodId, mealType) {

    showLoading();

    await originalSaveMeal(foodId, mealType);

    hideLoading();

};


// =====================================================
// OVERRIDE DELETE
// =====================================================

const originalDeleteMeal = deleteMeal;

deleteMeal = async function (id) {

    showLoading();

    await originalDeleteMeal(id);

    hideLoading();

};


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("th-TH", {

        day: "numeric",
        month: "long",
        year: "numeric"

    });

}


// =====================================================
// INITIALIZE
// =====================================================

window.addEventListener("load", () => {

    updateEmptyState();

});


// =====================================================
// END OF FILE
// =====================================================
