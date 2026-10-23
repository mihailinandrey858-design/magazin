document.addEventListener("DOMContentLoaded", () => {
  const subsBody = document.getElementById("subs-body");
  const ordersBody = document.getElementById("orders-body");
  const clearBtn = document.getElementById("clear-data");

  function loadAdminData() {
    // 1. Загрузка подписчиков (email)
    const subscribers = JSON.parse(localStorage.getItem("coffee_subscribers") || "[]");
    if (subscribers.length === 0) {
      subsBody.innerHTML = `<tr><td colspan="3" class="empty-msg">Пока нет подписчиков.</td></tr>`;
    } else {
      subsBody.innerHTML = subscribers
        .map(
          (sub, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${sub.email}</strong></td>
          <td>${sub.date}</td>
        </tr>`
        )
        .join("");
    }

    // 2. Загрузка общих заявок / бронирований
    const orders = JSON.parse(localStorage.getItem("coffee_orders") || "[]");
    if (orders.length === 0) {
      ordersBody.innerHTML = `<tr><td colspan="4" class="empty-msg">Пока нет новых заявок.</td></tr>`;
    } else {
      ordersBody.innerHTML = orders
        .map(
          (order, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${order.contact || "Не указано"}</td>
          <td>${order.details}</td>
          <td>${order.date}</td>
        </tr>`
        )
        .join("");
    }
  }

  // Очистка всех данных
  clearBtn.addEventListener("click", () => {
    if (confirm("Вы уверены, что хотите удалить все собранные заявки и почты?")) {
      localStorage.removeItem("coffee_subscribers");
      localStorage.removeItem("coffee_orders");
      loadAdminData();
    }
  });

  loadAdminData();
});