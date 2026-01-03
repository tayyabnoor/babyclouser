# Code Reference - Product Navigation & Color Selection

## Quick Reference Guide

---

## 1. Product Click Handler

**Location:** `js/main.js` (lines 4-28)

```javascript
$(document).on("click", ".product-link, .product-item", function (e) {
  // Only proceed if it's a product-detail.html link
  const href = $(this).attr("href") || $(this).closest("a").attr("href");
  if (!href || !href.includes("product-detail")) {
    return;
  }

  // Get closest product-item
  const $productItem = $(this).closest(".product-item");
  if ($productItem.length === 0) {
    return;
  }

  // Extract product data
  const productData = {
    title: $productItem
      .find(".product-content .title a, .product-content .title")
      .first()
      .text()
      .trim(),
    image: $productItem.find(".product-image img").attr("src"),
    price: $productItem.find(".product-content .price").text().trim(),
    hasColors: $productItem.data("colors") === "yes",
  };

  // Store in localStorage only if we have valid data
  if (productData.title && productData.image) {
    localStorage.setItem("selectedProduct", JSON.stringify(productData));
  }
});
```

---

## 2. Product Detail Loader

**Location:** `js/main.js` (lines 30-59)

```javascript
function loadProductDetail() {
  const productData = JSON.parse(localStorage.getItem("selectedProduct"));

  if (productData && productData.title && productData.image) {
    // Update product title and price
    $(".product-content .title h2").text(productData.title);
    $(".product-content .price").text(productData.price);

    // Update product image
    const imgHtml = `<img src="${productData.image}" alt="Product Image">`;
    $(".product-slider-single").empty().html(imgHtml);

    // Reinitialize slick slider
    if ($(".product-slider-single").hasClass("slick-initialized")) {
      $(".product-slider-single").slick("unslick");
    }
    $(".product-slider-single").slick({
      infinite: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
    });

    // Handle color selection if product has colors
    if (productData.hasColors) {
      initializeColorSelection();
    }
  }
}
```

---

## 3. Color Selection Initializer

**Location:** `js/main.js` (lines 61-80)

```javascript
function initializeColorSelection() {
  // Prevent duplicate color selections
  if ($(".color-selection").length > 0) {
    return;
  }

  const colors = [
    "Red",
    "Blue",
    "Green",
    "Pink",
    "Yellow",
    "Brown",
    "White",
    "Black",
  ];
  const colorContainer = $(
    '<div class="color-selection" style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;"><h4>Select Color:</h4><div id="color-options"></div></div>'
  );

  // Insert color selection after quantity selector
  $(".quantity").after(colorContainer);

  // Initially render as radio buttons
  renderColorOptions("radio", colors);

  // Monitor quantity changes
  monitorQuantityChanges(colors);
}
```

---

## 4. Color Options Renderer

**Location:** `js/main.js` (lines 82-99)

```javascript
function renderColorOptions(type, colors) {
  const $colorOptions = $("#color-options");
  $colorOptions.empty();

  colors.forEach((color) => {
    const inputId = `color-${color.toLowerCase()}`;
    const inputType = type === "radio" ? "radio" : "checkbox";
    const groupName = type === "radio" ? "productColor" : "productColors";

    const $colorLabel = $(`
            <label style="display: inline-block; margin-right: 20px; margin-bottom: 10px; cursor: pointer;">
                <input type="${inputType}" name="${groupName}" value="${color}" id="${inputId}" data-color="${color}">
                <span style="margin-left: 8px;">${color}</span>
            </label>
        `);

    $colorOptions.append($colorLabel);
  });
}
```

---

## 5. Quantity Change Monitor

**Location:** `js/main.js` (lines 101-123)

```javascript
function monitorQuantityChanges(colors) {
  let lastQuantity = parseInt($(".qty input").val()) || 1;

  $(".qty button").on("click", function () {
    setTimeout(() => {
      const currentQuantity = parseInt($(".qty input").val()) || 1;

      // Toggle between radio and checkbox based on quantity
      if (lastQuantity === 1 && currentQuantity > 1) {
        // Convert from radio to checkbox
        renderColorOptions("checkbox", colors);
      } else if (lastQuantity > 1 && currentQuantity === 1) {
        // Convert from checkbox to radio
        renderColorOptions("radio", colors);
      }

      lastQuantity = currentQuantity;
    }, 50);
  });
}
```

---

## 6. localStorage Data Access

**Get Product Data:**

```javascript
const productData = JSON.parse(localStorage.getItem("selectedProduct"));
console.log(productData.title);
console.log(productData.price);
console.log(productData.image);
console.log(productData.hasColors);
```

**Clear Product Data:**

```javascript
localStorage.removeItem("selectedProduct");
```

**Check if Data Exists:**

```javascript
if (localStorage.getItem("selectedProduct")) {
  console.log("Product data found");
} else {
  console.log("No product data");
}
```

---

## 7. CSS Styling Reference

**Color Selection Container:**

```css
.color-selection {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}
```

**Color Selection Labels:**

```css
.color-selection label {
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.color-selection label:hover {
  transform: translateX(2px);
}
```

**Color Inputs:**

```css
.color-selection input[type="radio"],
.color-selection input[type="checkbox"] {
  cursor: pointer;
  margin-right: 5px;
  accent-color: #109cdc;
}
```

---

## 8. HTML Structure

**Product Card Template:**

```html
<div class="product-item" data-colors="yes">
  <div class="product-image">
    <a href="product-detail.html" class="product-link">
      <img src="path/to/image.jpg" alt="Product Image" />
    </a>
  </div>
  <div class="product-content">
    <div class="title">
      <a href="product-detail.html" class="product-link">Product Name</a>
    </div>
    <div class="price">Price Info</div>
  </div>
</div>
```

**Product Detail Page:**

```html
<div class="quantity">
  <h4>Quantity:</h4>
  <div class="qty">
    <button class="btn-minus"><i class="fa fa-minus"></i></button>
    <input type="text" value="1" />
    <button class="btn-plus"><i class="fa fa-plus"></i></button>
  </div>
</div>
<!-- Color selection is injected here by JavaScript -->
```

---

## 9. Common Operations

**Get Selected Colors (Radio):**

```javascript
const selectedColor = $('input[name="productColor"]:checked').val();
console.log(selectedColor);
```

**Get Selected Colors (Checkboxes):**

```javascript
const selectedColors = [];
$('input[name="productColors"]:checked').each(function () {
  selectedColors.push($(this).val());
});
console.log(selectedColors);
```

**Check Current Quantity:**

```javascript
const currentQuantity = parseInt($(".qty input").val());
console.log(currentQuantity);
```

**Get Current Input Type:**

```javascript
const inputType = $("#color-options input").first().attr("type");
console.log(inputType); // 'radio' or 'checkbox'
```

---

## 10. Debugging Tips

**Enable Console Logging:**

```javascript
// Add to loadProductDetail() function
const productData = JSON.parse(localStorage.getItem("selectedProduct"));
console.log("Loaded product:", productData);
console.log("Has colors:", productData?.hasColors);
```

**Check localStorage Contents:**

```javascript
// In browser console
JSON.parse(localStorage.getItem("selectedProduct"));
```

**Verify DOM Elements:**

```javascript
console.log($(".color-selection").length); // Should be > 0
console.log($("#color-options input").length); // Should be 8
console.log($(".qty input").val()); // Should show quantity
```

**Clear Cache for Testing:**

```javascript
localStorage.clear();
location.reload();
```

---

## 11. Event Delegation

**Product Click Handler Uses Event Delegation:**

```javascript
// Works on dynamically added products
$(document).on('click', '.product-link, .product-item', function() { ... });
```

**Not Using Direct Bind:**

```javascript
// ❌ Won't work for dynamic products
$('.product-link').on('click', function() { ... });
```

---

## 12. Responsive Breakpoints

**Mobile Layout (< 576px):**

- Color options stack vertically
- Labels display as block elements
- Full-width touch targets

**Desktop Layout (≥ 576px):**

- Color options display inline
- Labels display inline-block
- Natural left-to-right flow

---

## 13. Performance Tips

**Optimize Color Array:**

```javascript
// Instead of creating array each time:
const colors = ['Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Brown', 'White', 'Black'];

// Define once outside function
const AVAILABLE_COLORS = ['Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Brown', 'White', 'Black'];

function renderColorOptions(type) {
    AVAILABLE_COLORS.forEach((color) => { ... });
}
```

**Prevent Multiple Initializations:**

```javascript
// Already implemented
if ($(".color-selection").length > 0) {
  return; // Prevents duplicate color UIs
}
```

---

## 14. Error Handling

**Safe localStorage Access:**

```javascript
try {
  const productData = JSON.parse(localStorage.getItem("selectedProduct"));
  if (productData) {
    // Process productData
  }
} catch (e) {
  console.error("Error parsing localStorage:", e);
}
```

**Null Checks:**

```javascript
if (productData && productData.title && productData.image) {
  // Safe to use productData
}
```

---

## 15. Browser DevTools Commands

**Test in Console:**

```javascript
// Store test product
localStorage.setItem(
  "selectedProduct",
  JSON.stringify({
    title: "Test Product",
    image: "img/test.jpg",
    price: "$99.99",
    hasColors: true,
  })
);

// Reload page
location.reload();

// Check what loaded
JSON.parse(localStorage.getItem("selectedProduct"));
```

---

**Last Updated:** December 22, 2025
**Version:** 1.0
**Status:** ✅ Complete
