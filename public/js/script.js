document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.getElementById("hamburger-menu");
  const navMenu = document.getElementById("nav-links");

  hamburger.addEventListener("click", function() {
    if (navMenu.style.display === "block") {
      navMenu.style.display = "none";  // hide if already shown
    } else {
      navMenu.style.display = "block"; // show if hidden
    }
  });
});



$(document).ready(function() {
  const apiURL = "https://fakestoreapi.com/products?limit=4";
  const container = $("#featured-container");

  // Fetch products
  $.ajax({
    url: apiURL,
    method: "GET",
    success: function(products) {
      container.empty(); // clear existing cards

      products.forEach(product => {
        const card = $(`
          <div class="card">
            <img src="${product.image}" alt="${product.title}">
            <div class="text-button-horizontal-div">
              <p class="card-title">${product.title}</p>
              <p class="card-price">$${product.price}</p>
              <button class="btn quick-view-button" data-id="${product.id}">Quick View</button>
            </div>
          </div>
        `);
        container.append(card);
      });
    }
  });

  // Quick View functionality
  $(document).on("click", ".quick-view-button", function() {
    const productId = $(this).data("id");
    $.getJSON(`https://fakestoreapi.com/products/${productId}`, function(product) {
      $("#modal-image").attr("src", product.image);
      $("#modal-title").text(product.title);
      $("#modal-description").text(product.description);
      $("#modal-price").text(`$${product.price}`);
      $("#modal-rating").text(`Rating: ${product.rating.rate} ⭐ (${product.rating.count} reviews)`);
      $("#quick-view-modal").fadeIn();
    });
  });

  // Close modal
  $(".close-button").click(function() {
    $("#quick-view-modal").fadeOut();
  });

  // Close modal on outside click
  $(window).click(function(event) {
    if ($(event.target).is("#quick-view-modal")) {
      $("#quick-view-modal").fadeOut();
    }
  });
});