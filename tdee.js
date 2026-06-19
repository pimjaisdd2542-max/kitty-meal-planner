// =====================================================
// tdee.js
// Part 1/4
// Kitty Meal Planner Ultimate
// =====================================================

let latestSetting = null;

document.addEventListener("DOMContentLoaded", async () => {

    await loadLatestTDEE();

    const calculateBtn = document.getElementById("calculateBtn");

    if(calculateBtn){

        calculateBtn.addEventListener("click", calculateTDEE);

    }

});


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

    latestSetting = data[0];

    document.getElementById("gender").value =
        latestSetting.gender;

    document.getElementById("age").value =
        latestSetting.age;

    document.getElementById("height").value =
        latestSetting.height;

    document.getElementById("weight").value =
        latestSetting.weight;

    document.getElementById("activity").value =
        latestSetting.activity;

    document.getElementById("goal").value =
        latestSetting.goal;

    document.getElementById("bmrResult").textContent =
        Number(latestSetting.bmr).toFixed(0) + " kcal";

    document.getElementById("tdeeResult").textContent =
        Number(latestSetting.tdee).toFixed(0) + " kcal";

    document.getElementById("goalCalories").textContent =
        Number(latestSetting.target_calories).toFixed(0) + " kcal";

    document.getElementById("tdeeAdvice").innerHTML = `

        <b>ข้อมูลล่าสุดถูกโหลดแล้ว</b><br><br>

        🔥 BMR :
        ${Number(latestSetting.bmr).toFixed(0)} kcal<br>

        ⚡ TDEE :
        ${Number(latestSetting.tdee).toFixed(0)} kcal<br>

        🎯 เป้าหมาย :
        ${Number(latestSetting.target_calories).toFixed(0)} kcal

    `;

}
// =====================================================
// CALCULATE TDEE
// Part 2/4
// =====================================================

function calculateTDEE(){

    const gender =
        document.getElementById("gender").value;

    const age =
        Number(document.getElementById("age").value);

    const height =
        Number(document.getElementById("height").value);

    const weight =
        Number(document.getElementById("weight").value);

    const activity =
        Number(document.getElementById("activity").value);

    const goal =
        Number(document.getElementById("goal").value);


    // =================================================
    // VALIDATE
    // =================================================

    if(age <= 0){

        alert("กรุณากรอกอายุ");

        return;

    }

    if(height <= 0){

        alert("กรุณากรอกส่วนสูง");

        return;

    }

    if(weight <= 0){

        alert("กรุณากรอกน้ำหนัก");

        return;

    }


    // =================================================
    // BMR (Mifflin-St Jeor)
    // =================================================

    let bmr = 0;

    if(gender === "male"){

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    }else{

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;

    }


    // =================================================
    // TDEE
    // =================================================

    const tdee =
        bmr * activity;


    // =================================================
    // TARGET CALORIES
    // =================================================

    const targetCalories =
        tdee + goal;


    // =================================================
    // SHOW RESULT
    // =================================================

    document.getElementById("bmrResult").textContent =
        Math.round(bmr) + " kcal";

    document.getElementById("tdeeResult").textContent =
        Math.round(tdee) + " kcal";

    document.getElementById("goalCalories").textContent =
        Math.round(targetCalories) + " kcal";


    // =================================================
    // ADVICE
    // =================================================

    let advice = "";

    if(goal < 0){

        advice =
            "🎯 เป้าหมาย: ลดน้ำหนัก<br>" +
            "แนะนำรับประทานประมาณ <b>" +
            Math.round(targetCalories) +
            " kcal</b> ต่อวัน";

    }
    else if(goal > 0){

        advice =
            "💪 เป้าหมาย: เพิ่มน้ำหนัก<br>" +
            "แนะนำรับประทานประมาณ <b>" +
            Math.round(targetCalories) +
            " kcal</b> ต่อวัน";

    }
    else{

        advice =
            "⚖ เป้าหมาย: คงน้ำหนัก<br>" +
            "แนะนำรับประทานประมาณ <b>" +
            Math.round(targetCalories) +
            " kcal</b> ต่อวัน";

    }

    document.getElementById("tdeeAdvice").innerHTML =
        advice;

}
// =====================================================
// SAVE TDEE
// Part 3/4
// =====================================================

async function saveTDEE(){

    const gender =
        document.getElementById("gender").value;

    const age =
        Number(document.getElementById("age").value);

    const height =
        Number(document.getElementById("height").value);

    const weight =
        Number(document.getElementById("weight").value);

    const activity =
        Number(document.getElementById("activity").value);

    const goal =
        Number(document.getElementById("goal").value);

    const bmr =
        Number(document.getElementById("bmrResult")
        .textContent.replace(" kcal",""));

    const tdee =
        Number(document.getElementById("tdeeResult")
        .textContent.replace(" kcal",""));

    const targetCalories =
        Number(document.getElementById("goalCalories")
        .textContent.replace(" kcal",""));

    const { error } = await supabaseClient
        .from("tdee_settings")
        .insert([

            {

                gender: gender,

                age: age,

                height: height,

                weight: weight,

                activity: activity,

                goal: goal,

                bmr: bmr,

                tdee: tdee,

                target_calories: targetCalories

            }

        ]);

    if(error){

        alert(error.message);

        console.log(error);

        return;

    }

    await loadLatestTDEE();

    alert("✅ บันทึกข้อมูล TDEE เรียบร้อย");

}
// =====================================================
// TDEE.JS
// Part 4/4
// =====================================================


// =====================================================
// REFRESH
// =====================================================

async function refreshTDEE(){

    await loadLatestTDEE();

}


// =====================================================
// RESET FORM
// =====================================================

function resetTDEEForm(){

    document.getElementById("gender").value = "female";

    document.getElementById("age").value = "";

    document.getElementById("height").value = "";

    document.getElementById("weight").value = "";

    document.getElementById("activity").value = "1.2";

    document.getElementById("goal").value = "-500";

}


// =====================================================
// USE LATEST WEIGHT (OPTIONAL)
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

    document.getElementById("weight").value =
        Number(data[0].weight).toFixed(1);

}


// =====================================================
// AUTO LOAD LATEST WEIGHT
// =====================================================

window.addEventListener("load",async()=>{

    if(document.getElementById("weight").value===""){

        await loadLatestWeight();

    }

});


// =====================================================
// AUTO REFRESH
// =====================================================

window.addEventListener("focus",async()=>{

    await refreshTDEE();

});


// =====================================================
// END
// =====================================================
