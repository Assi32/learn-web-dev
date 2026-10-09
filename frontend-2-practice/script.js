console.log("Задание 2 загружено!");

document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("output");
    const btn = document.getElementById("btn");

    output.textContent = "Привет! JavaScript подключён и работает.";

    btn.addEventListener("click", function () {
        output.textContent = "Кнопка нажата! Всё работает.";
        output.style.color = "green";
    });
});