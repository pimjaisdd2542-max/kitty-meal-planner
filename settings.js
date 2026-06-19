// =====================================================
// settings.js
// Part 1/4
// Kitty Meal Planner Ultimate
// =====================================================

let latestSettings = null;

document.addEventListener("DOMContentLoaded", async () => {

    await loadSettings();

    const saveButton = document.getElementById("saveSettings");

    if(saveButton){

        saveButton.addEventListener("click", saveSettings);

    }

});


// =====================================================
// LOAD SETTINGS
// =====================================================

async function loadSettings(){

    const { data, error } = await supabaseClient
        .from("settings")
        .select("*")
        .order("created_at",{ascending:false})
        .limit(1);

    if(error){

        console.log(error);

        return;

    }

    if(data.length===0){

        return;

    }

    latestSettings = data[0];

    document.getElementById("name").value =
        latestSettings.name || "";

    document.getElementById("gender").value =
        latestSettings.gender || "female";

    document.getElementById("age").value =
        latestSettings.age || "";

    document.getElementById("height").value =
        latestSettings.height || "";

    document.getElementById("calorieGoal").value =
        latestSettings.calorie_goal || "";

    document.getElementById("proteinGoal").value =
        latestSettings.protein_goal || "";

    document.getElementById("carbGoal").value =
        latestSettings.carb_goal || "";

    document.getElementById("fatGoal").value =
        latestSettings.fat_goal || "";

    document.getElementById("waterGoal").value =
        latestSettings.water_goal || "";

    renderSummary();

}


// =====================================================
// SUMMARY
// =====================================================

function renderSummary(){

    const summary =
        document.getElementById("settingsSummary");

    if(!latestSettings){

        summary.innerHTML = "ยังไม่มีข้อมูล";

        return;

    }

    summary.innerHTML = `

        👤 <b>${latestSettings.name}</b><br><br>

        🔥 Calories :
        ${latestSettings.calorie_goal ?? "-"} kcal<br>

        💪 Protein :
        ${latestSettings.protein_goal ?? "-"} g<br>

        🍞 Carb :
        ${latestSettings.carb_goal ?? "-"} g<br>

        🥑 Fat :
        ${latestSettings.fat_goal ?? "-"} g<br>

        💧 Water :
        ${latestSettings.water_goal ?? "-"} ml

    `;

}
// =====================================================
// SAVE SETTINGS
// Part 2/4
// =====================================================

async function saveSettings(){

    const name =
        document.getElementById("name").value.trim();

    const gender =
        document.getElementById("gender").value;

    const age =
        Number(document.getElementById("age").value);

    const height =
        Number(document.getElementById("height").value);

    const calorieGoal =
        Number(document.getElementById("calorieGoal").value);

    const proteinGoal =
        Number(document.getElementById("proteinGoal").value);

    const carbGoal =
        Number(document.getElementById("carbGoal").value);

    const fatGoal =
        Number(document.getElementById("fatGoal").value);

    const waterGoal =
        Number(document.getElementById("waterGoal").value);


    // =================================================
    // VALIDATE
    // =================================================

    if(name === ""){

        alert("กรุณากรอกชื่อ");

        return;

    }

    if(age <= 0){

        alert("กรุณากรอกอายุ");

        return;

    }

    if(height <= 0){

        alert("กรุณากรอกส่วนสูง");

        return;

    }


    // =================================================
    // SAVE TO SUPABASE
    // =================================================

    const { error } = await supabaseClient
        .from("settings")
        .insert([

            {

                name: name,

                gender: gender,

                age: age,

                height: height,

                calorie_goal: calorieGoal,

                protein_goal: proteinGoal,

                carb_goal: carbGoal,

                fat_goal: fatGoal,

                water_goal: waterGoal

            }

        ]);

    if(error){

        alert(error.message);

        console.log(error);

        return;

    }

    alert("✅ บันทึกการตั้งค่าเรียบร้อย");

    await loadSettings();

}
// =====================================================
// RESET FORM
// Part 3/4
// =====================================================

function resetSettings(){

    document.getElementById("name").value = "";

    document.getElementById("gender").value = "female";

    document.getElementById("age").value = "";

    document.getElementById("height").value = "";

    document.getElementById("calorieGoal").value = "";

    document.getElementById("proteinGoal").value = "";

    document.getElementById("carbGoal").value = "";

    document.getElementById("fatGoal").value = "";

    document.getElementById("waterGoal").value = "";

}


// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateSummaryFromForm(){

    const summary =
        document.getElementById("settingsSummary");

    summary.innerHTML = `

        👤 <b>${document.getElementById("name").value || "-"}</b><br><br>

        ⚧ เพศ :
        ${document.getElementById("gender").value === "male" ? "ชาย" : "หญิง"}<br>

        🎂 อายุ :
        ${document.getElementById("age").value || "-"} ปี<br>

        📏 ส่วนสูง :
        ${document.getElementById("height").value || "-"} cm<br><br>

        🔥 Calories :
        ${document.getElementById("calorieGoal").value || "-"} kcal<br>

        💪 Protein :
        ${document.getElementById("proteinGoal").value || "-"} g<br>

        🍞 Carb :
        ${document.getElementById("carbGoal").value || "-"} g<br>

        🥑 Fat :
        ${document.getElementById("fatGoal").value || "-"} g<br>

        💧 Water :
        ${document.getElementById("waterGoal").value || "-"} ml

    `;

}


// =====================================================
// AUTO UPDATE SUMMARY
// =====================================================

const formIds = [

    "name",

    "gender",

    "age",

    "height",

    "calorieGoal",

    "proteinGoal",

    "carbGoal",

    "fatGoal",

    "waterGoal"

];

formIds.forEach(id=>{

    const element = document.getElementById(id);

    if(element){

        element.addEventListener("input",updateSummaryFromForm);

        element.addEventListener("change",updateSummaryFromForm);

    }

});
// =====================================================
// SETTINGS.JS
// Part 4/4
// Kitty Meal Planner Ultimate
// =====================================================


// =====================================================
// LOAD LATEST TDEE
// =====================================================

async function loadLatestTDEE(){

    const { data, error } = await supabaseClient
        .from("tdee_settings")
        .select("*")
        .order("created_at",{ascending:false})
        .limit(1);

    if(error){

        console.log(error);

        return;

    }

    if(data.length===0){

        return;

    }

    const tdee = data[0];

    if(!document.getElementById("gender").value){

        document.getElementById("gender").value =
            tdee.gender;

    }

    if(!document.getElementById("age").value){

        document.getElementById("age").value =
            tdee.age;

    }

    if(!document.getElementById("height").value){

        document.getElementById("height").value =
            tdee.height;

    }

    if(!document.getElementById("calorieGoal").value){

        document.getElementById("calorieGoal").value =
            Math.round(tdee.target_calories);

    }

}


// =====================================================
// LOAD LATEST WEIGHT
// =====================================================

async function loadLatestWeight(){

    const { data, error } = await supabaseClient
        .from("weight_history")
        .select("weight")
        .order("record_date",{ascending:false})
        .limit(1);

    if(error){

        console.log(error);

        return;

    }

    if(data.length===0){

        return;

    }

    updateSummaryFromForm();

}


// =====================================================
// AUTO LOAD
// =====================================================

window.addEventListener("load", async()=>{

    await loadLatestTDEE();

    await loadLatestWeight();

    updateSummaryFromForm();

});


// =====================================================
// REFRESH WHEN RETURN TO PAGE
// =====================================================

window.addEventListener("focus", async()=>{

    await loadSettings();

});


// =====================================================
// END OF FILE
// =====================================================
