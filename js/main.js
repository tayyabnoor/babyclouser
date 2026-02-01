(function ($) {
    "use strict";

    // products.js
    const products_images = [
        {
            name: 'Premium Teddy Bear (2.3ft)',
            images: ['img/products/premium-2_5-ft-teddy/pink_small_teddy-compressed.webp', 'img/products/premium-2_5-ft-teddy/white.jpeg', 'img/products/premium-2_5-ft-teddy/red.jpeg','img/products/premium-2_5-ft-teddy/blue.jpeg','img/products/premium-2_5-ft-teddy/yellow.jpeg','img/products/premium-2_5-ft-teddy/brown.jpeg','img/products/premium-2_5-ft-teddy/peach.jpeg'],
        },
        {
            name: 'Luxury Imported Teddy Bear (3.5ft)',
            images: ['img/products/luxury-teddy-3_5/teddy_white_4.4 ft.webp', 'img/products/luxury-teddy-3_5/yellow.jpeg', 'img/products/luxury-teddy-3_5/blue.jpeg','img/products/luxury-teddy-3_5/brown.jpeg','img/products/luxury-teddy-3_5/pink.jpeg','img/products/luxury-teddy-3_5/red.webp'],
        },
        {
            name: 'Premium Teddy Bear (4.4ft)',
            images: ['img/products/premium-teddy-4_5/brown.jpg', 'img/products/premium-teddy-4_5/white.jpg','img/products/premium-teddy-4_5/pink.jpg','img/products/premium-teddy-4_5/yellow.jpg','img/products/premium-teddy-4_5/blue.jpg','img/products/premium-teddy-4_5/red.jpeg','img/products/premium-teddy-4_5/peach.jpg'
            ],
        },
        {
            name: 'Premium Teddy Bear (5.6ft)',
            images: ['img/products/premium-teddy-4_5/blue.jpg','img/products/premium-teddy-4_5/brown.jpg','img/products/premium-teddy-4_5/white.jpg','img/products/premium-teddy-4_5/pink.jpg','img/products/premium-teddy-4_5/yellow.jpg','img/products/premium-teddy-4_5/red.jpeg','img/products/premium-teddy-4_5/peach.jpg'
            ]
        },
        {
            name: 'Luxury Imported Teddy Bear (3.5ft)',
            images: ['img/products/luxury-teddy-3_5/teddy_white_4.4 ft.webp', 'img/products/luxury-teddy-3_5/yellow.jpeg', 'img/products/luxury-teddy-3_5/blue.jpeg','img/products/luxury-teddy-3_5/brown.jpeg','img/products/luxury-teddy-3_5/pink.jpeg','img/products/luxury-teddy-3_5/red.jpeg']
        },
        {
            name: 'Luxury Imported Teddy Bear (5.5ft)',
            images: ['img/products/luxury-teddy-5-5ft/off-white.jpg','img/products/luxury-teddy-5-5ft/pink.jpeg','img/products/luxury-teddy-5-5ft/brown.jpeg','img/products/luxury-teddy-5-5ft/red.jpeg']
        },
        {
            name: 'Luxury Imported Teddy Bear (6ft)',
            images: ['img/products/luxury-6ft-tedy/red.webp','img/products/luxury-6ft-tedy/white.jpg','img/products/luxury-6ft-tedy/brown.jpg','img/products/luxury-6ft-tedy/pink.jpg']
        },
        {
            name: 'Lavender Roses',
            images: ['img/products/Crochet_flower_bouquet/chrochet_flower_main.jpg','img/products/Crochet_flower_bouquet/chrochet_flower_2.jpg','img/products/Crochet_flower_bouquet/chrochet_flower_3.jpg','img/products/Crochet_flower_bouquet/chrochet_flower_4.jpg']
        },
        {
            name: 'Pink Peony Posy',
            images: ['img/products/pink_peony_posy/pink_peony_main.jpg','img/products/pink_peony_posy/pink_peony_2.jpg','img/products/pink_peony_posy/pink_peony_3.jpg']
        },
        {
            name: 'Persian Buttercup',
            images: ['img/products/persion_bc/persian_bc_main.jpg','img/products/persion_bc/persian_bc_2.jpg']
        },
        {
            name: 'Sweet Sparkle',
            images: ['img/products/sweet_sparkle/sweet_sparkle_main.jpg','img/products/sweet_sparkle/sweet_sparkle_2.jpg','img/products/sweet_sparkle/sweet_sparkle_3.jpg']
        },
        {
            name: 'Ivory-colored roses',
            images: ['img/products/Ivory-colored roses/ivory_roses_main.jpg','img/products/Ivory-colored roses/ivory_roses_2.jpg','img/products/Ivory-colored roses/ivory_roses_1.jpg']
        },
        {
            name: 'Blue Glitter Roses',
            images: ['img/products/blue glitter roses/blue-glitter-roses-2.jpg','img/products/blue glitter roses/blue-glitter-roses-main.jpg']
        },
        {
            name: 'Camellias',
            images: ['img/products/Camellias/Camellias_1.jpg','img/products/Camellias/Camellias-main.jpg']
        },
        {
            name: 'White Dahlia Flowers',
            images: ['img/products/dahlia/dhalia_1.jpg','img/products/dahlia/dhalia_main.jpg']
        },
        {
            name: 'Pots of Plants',
            images: ['img/products/Pot of Plants/eucalapsus_plant.jpg','img/products/Pot of Plants/faux greenery.jpg','img/products/Pot of Plants/green_grass.jpg','img/products/Pot of Plants/green_roses_plant.jpg','img/products/Pot of Plants/orange_roses_plant.jpg','img/products/Pot of Plants/red_roses_plant.jpg','img/products/Pot of Plants/orange_tigger_lilly.jpg','img/products/Pot of Plants/pink_tigger_lilly.jpg','img/products/Pot of Plants/yellow_tiger_lilly.jpg']
        },
        {
            name: 'Single Flower Bouquet',
            images: ['img/products/single-rose-bouquet/srb_1.jpg','img/products/single-rose-bouquet/srb_2.jpg','img/products/single-rose-bouquet/srb_3.jpg']
        },
        {
            name: 'Valentine Deal',
            images: ['img/products/deal-2026/deal-2026-02.jpg','img/products/deal-2026/deal-2026-03.jpg','img/products/deal-2026/deal-2026-04.jpg']
        }
        // ...
    ];
    
    // Product Click Handler - capture product data and navigate reliably
    $(document).on('click', 'a[href*="product-detail.html"]', function(e) {
        const $a = $(this);
        const href = $a.attr('href');

        // Find the closest product item container
        const $productItem = $a.closest('.product-item');
        if ($productItem.length === 0) {
            // If not inside a .product-item, allow default navigation
            return;
        }

        e.preventDefault(); // ensure we store data before navigating

        // Extract product data (use HTML for price to preserve spans)
        const title = $productItem.find('.product-content .title a, .product-content .title').first().text().trim();
        const image = $productItem.find('.product-image img').attr('src') || '';
        const $priceEl = $productItem.find('.product-content .price').first();
        const priceHtml = $priceEl.html() || $priceEl.text() || '';
        // Extract explicit current and old prices: direct text node vs span
        const priceOld = ($priceEl.find('span').first().text() || '').toString().trim();
        const priceCurrent = (function() {
            try {
                const $clone = $priceEl.clone();
                $clone.find('span').remove();
                return $clone.text().trim();
            } catch (e) {
                return ($priceEl.text() || '').trim();
            }
        })();
        // Extract colors: if data-colors contains a list, parse it; otherwise use default if 'yes'
        const hasColors = ($productItem.data('colors') || '').toString().toLowerCase() !== '';
        let colors = [];
        if (hasColors) {
            const colorsAttr = ($productItem.data('colors') || '').toString().trim();
            if (colorsAttr !== 'yes') {
                // Try to parse as a list: "Red, Blue, Green" or "'Red', 'Blue', 'Green'"
                try {
                    // Remove quotes and split by comma
                    colors = colorsAttr.split(',').map(c => c.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
                } catch (e) {
                    colors = [];
                }
            }
            // If no colors parsed or 'yes', use fallback default colors
            if (colors.length === 0) {
                colors = ['Red', 'Blue', 'Pink', 'Yellow', 'Brown', 'White', 'Peach'];
            }
        }
        const mulImg = ($productItem.attr('mul-img') || '').toString().toLowerCase() === 'yes';
        const category = ($productItem.data('category') || '').toString().trim();

        // Prefer a data-description attribute if present, otherwise create a simple one using the title
        const description = ($productItem.data('description') || $productItem.find('.product-content .description').text() || '').toString().trim() || (`High quality product: ${title}`);

        // Specs may be provided as a data-specs attribute (pipe '|' separated), e.g. "Material: Plush|Size: 6ft"
        const specsRaw = ($productItem.data('specs') || '').toString();
        let specs = [];
        if (specsRaw) {
            specs = specsRaw.split('|').map(s => s.trim()).filter(Boolean);
        } else {
            // Fallback specs if none provided
            specs = [
                `Product: ${title}`,
                'Material: High quality',
                'Care: Spot clean only'
            ];
        }

        const productData = {
            title: title,
            image: image,
            // raw HTML (for fallback)
            price: priceHtml,
            // explicit values (preferred)
            priceCurrent: priceCurrent,
            priceOld: priceOld,
            hasColors: hasColors,
            colors: colors,
            mulImg: mulImg,
            category: category,
            description: description,
            specs: specs
        };

        // Store in localStorage and then navigate
        try {
            localStorage.setItem('selectedProduct', JSON.stringify(productData));
        } catch (err) {
            console.error('Could not store product data:', err);
        }

        // Navigate after a tiny delay to ensure storage completed
        setTimeout(() => {
            window.location.href = href;
        }, 10);
    });

    // WhatsApp order handler
    const WHATSAPP_PHONE = '923015755700';

    function extractCurrentPriceFromPriceEl($priceEl) {
        try {
            if (!$priceEl || !$priceEl.length) return '';
            const $clone = $priceEl.clone();
            $clone.find('span').remove();
            return ($clone.text() || '').trim();
        } catch (e) {
            return '';
        }
    }

    function openWhatsAppOrder(productName, priceText, colors) {
        const cleanName = (productName || '').toString().trim();
        const cleanPrice = (priceText || '').toString().trim();
        const colorList = Array.isArray(colors) ? colors.map(c => (c || '').toString().trim()).filter(Boolean) : [];

        let msg = 'Assalam-o-Alaikum! I want to order:';
        if (cleanName) msg += `\nProduct: ${cleanName}`;
        if (cleanPrice) msg += `\nPrice: ${cleanPrice}`;
        if (colorList.length) msg += `\nColor: ${colorList.join(', ')}`;

        const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    }

    $(document).on('click', '.order-whatsapp', function (e) {
        e.preventDefault();

        const $btn = $(this);
        const $productItem = $btn.closest('.product-item');
        const onDetailPage = $btn.closest('.product-detail').length > 0;

        // Prefer product data stored for detail page
        if (onDetailPage) {
            let productData = null;
            try {
                productData = JSON.parse(localStorage.getItem('selectedProduct'));
            } catch (err) {
                productData = null;
            }

            const title = (productData && productData.title) ? productData.title : ($('.product-detail .product-detail-top .product-content .title h2').text() || '').trim();
            const price = (productData && productData.priceCurrent) ? productData.priceCurrent : extractCurrentPriceFromPriceEl($('.product-detail .product-detail-top .product-content .price').first());

            // If colors UI exists, collect selected values (radio or checkbox)
            const selectedColors = $('#color-options input:checked').map(function () { return this.value; }).get();
            openWhatsAppOrder(title, price, selectedColors);
            return;
        }

        // Product list / other cards
        let title = '';
        let price = '';
        if ($productItem.length) {
            title = $productItem.find('.product-content .title a, .product-content .title').first().text().trim();
            price = extractCurrentPriceFromPriceEl($productItem.find('.product-content .price').first());
        }

        // As a fallback, try data attributes (if present)
        if (!title) title = ($btn.data('name') || '').toString().trim();
        if (!price) price = ($btn.data('price') || '').toString().trim();

        openWhatsAppOrder(title, price, []);
    });
    
    // Load and display product details on product-detail page
    function loadProductDetail() {
        const productData = JSON.parse(localStorage.getItem('selectedProduct'));
        
        if (productData && productData.title && productData.image) {
            // Update only the main product area title, price and description
            $('.product-detail .product-detail-top .product-content .title h2').text(productData.title);

            // Render price using explicit current/old values when available
            try {
                let priceHtmlOut = '';
                if (productData.priceCurrent) {
                    priceHtmlOut += `<span class="current-price">${productData.priceCurrent}</span>`;
                }
                if (productData.priceOld) {
                    priceHtmlOut += ` <span class="old-price">${productData.priceOld}</span>`;
                }

                // Fallback: parse raw HTML or use raw value
                if (!priceHtmlOut) {
                    const $tmp = $('<div>').html(productData.price || '');
                    const oldPrice = $tmp.find('span').first().text().trim();
                    $tmp.find('span').remove();
                    const currentPrice = $tmp.text().trim();
                    if (currentPrice) priceHtmlOut += `<span class="current-price">${currentPrice}</span>`;
                    if (oldPrice) priceHtmlOut += ` <span class="old-price">${oldPrice}</span>`;
                    if (!priceHtmlOut) priceHtmlOut = productData.price || '';
                }

                $('.product-detail .product-detail-top .product-content .price').first().html(priceHtmlOut);
            } catch (err) {
                $('.product-detail .product-detail-top .product-content .price').first().html(productData.price || '');
            }
            // Update description tab content (use html to allow formatted text)
            const descHtml = `<h4>Product description</h4><p>${productData.description || ''}</p>`;
            $('#description').empty().html(descHtml);

            // Update specification tab content
            let specsHtml = '<h4>Product specification</h4>';
            if (productData.specs && productData.specs.length > 0) {
                specsHtml += '<ul>' + productData.specs.map(s => `<li>${s}</li>`).join('') + '</ul>';
            } else {
                specsHtml += '<p>No specifications available for this product.</p>';
            }
            $('#specification').empty().html(specsHtml);
            
            // Update product image(s)
            // If mulImg is set, look up the images array by product name in `products_images`.
            let slidesHtml = '';
            const normalizeProductName = (v) => (v || '').toString().replace(/\s+/g, ' ').trim().toLowerCase();
            const wantedName = normalizeProductName(productData.title);
            const match = products_images.find(p => normalizeProductName(p && p.name) === wantedName);
            if ((productData.mulImg || match) && match && Array.isArray(match.images) && match.images.length) {
                slidesHtml = match.images.map(src => `<div><img src="${src}" alt="Product Image"></div>`).join('');
            }

            // Fallback to single image if no multi images found
            if (!slidesHtml) {
                slidesHtml = `<div><img src="${productData.image}" alt="Product Image"></div>`;
            }

            // Replace slider content and (re)initialize slick
            const $slider = $('.product-slider-single');
            if ($slider.hasClass('slick-initialized')) {
                $slider.slick('unslick');
            }
            $slider.empty().html(slidesHtml);
            $slider.slick({
                infinite: true,
                dots: true,
                slidesToShow: 1,
                slidesToScroll: 1
            });
            
            // Handle color selection if product has colors
            if (productData.hasColors) {
                initializeColorSelection(productData.colors);
            }

            // Ensure the Add to Cart anchor on product-detail has proper data attributes
            try {
                const $addBtn = $('.product-detail .action .add-to-cart');
                if ($addBtn.length) {
                    // derive numeric price from priceCurrent or raw price
                    let numericPrice = 0;
                    if (productData.priceCurrent) {
                        const m = String(productData.priceCurrent).match(/[\d,]+/);
                        if (m) numericPrice = Number(m[0].replace(/,/g, ''));
                    }
                    if (!numericPrice && productData.price) {
                        const m2 = String(productData.price).match(/[\d,]+/);
                        if (m2) numericPrice = Number(m2[0].replace(/,/g, ''));
                    }

                    // set id, name, price, image so cart logic picks them up
                    const idVal = productData.id || ('pd-' + (productData.title || '').replace(/\s+/g, '-').toLowerCase());
                    $addBtn.attr('data-id', idVal);
                    $addBtn.attr('data-name', productData.title || $addBtn.attr('data-name') || 'Product');
                    $addBtn.attr('data-price', numericPrice || $addBtn.attr('data-price') || 0);
                    $addBtn.attr('data-image', productData.image || $addBtn.attr('data-image') || '');
                    $addBtn.attr('data-category', productData.category || $addBtn.attr('data-category') || '');
                }
            } catch (e) {
                // silent
            }
        }
    }
    
    // Initialize color selection UI
    function initializeColorSelection(colors) {
        // Prevent duplicate color selections
        if ($('.color-selection').length > 0) {
            return;
        }
        
        // Use passed colors array, fallback to defaults if empty
        if (!colors || colors.length === 0) {
            colors = ['Red', 'Blue', 'Pink', 'Yellow', 'Brown', 'White', 'Peach'];
        }
        
        const colorContainer = $('<div class="color-selection" style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;"><h4>Choose Many:</h4><div id="color-options"></div></div>');
        
        // Insert color selection after quantity selector
        $('.quantity').after(colorContainer);
        
        // Initially render as radio buttons
        renderColorOptions('radio', colors);
        
        // Monitor quantity changes
        monitorQuantityChanges(colors);
    }
    
    // Render color options as radio or checkbox, optionally marking preselected values
    function renderColorOptions(type, colors, preselected) {
        preselected = preselected || [];
        const preNormalized = preselected.map(p => (p || '').toString().trim().toLowerCase());
        const $colorOptions = $('#color-options');
        $colorOptions.empty();
    
        colors.forEach((color) => {
            const safeId = color.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
            const inputId = `color-${safeId}`;
            const inputType = type === 'radio' ? 'radio' : 'checkbox';
            const groupName = type === 'radio' ? 'productColor' : 'productColors';
            const isChecked = preNormalized.includes(color.toString().trim().toLowerCase());
            const checkedAttr = isChecked ? 'checked' : '';
            const $colorLabel = $(`
                <label style="display: inline-block; margin-right: 20px; margin-bottom: 10px; cursor: pointer;">
                    <input type="${inputType}" name="${groupName}" value="${color}" id="${inputId}" data-color="${color}" ${checkedAttr}>
                    <span style="margin-left: 8px;">${color}</span>
                </label>
            `);
        
            $colorOptions.append($colorLabel);
        });
    }
    
    // Monitor quantity changes to toggle radio/checkbox
    function monitorQuantityChanges(colors) {
        let lastQuantity = parseInt($('.qty input').val()) || 1;
        
        $('.qty button').on('click', function() {
            setTimeout(() => {
                const currentQuantity = parseInt($('.qty input').val()) || 1;
                
                // Toggle between radio and checkbox based on quantity
                if (lastQuantity === 1 && currentQuantity > 1) {
                    // Convert from radio to checkbox, preserve previously selected radio if any
                    const selected = $('#color-options input[name="productColor"]:checked').map(function() { return this.value; }).get();
                    const pre = (selected && selected.length) ? selected : (colors && colors.length ? [colors[0]] : []);
                    renderColorOptions('checkbox', colors, pre);
                } else if (lastQuantity > 1 && currentQuantity === 1) {
                    // Convert from checkbox to radio, pick first checked checkbox if any
                    const checked = $('#color-options input[name="productColors"]:checked').map(function() { return this.value; }).get();
                    const pick = (checked && checked.length) ? [checked[0]] : (colors && colors.length ? [colors[0]] : []);
                    renderColorOptions('radio', colors, pick);
                }
                
                lastQuantity = currentQuantity;
            }, 50);
        });
    }
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        // Load product detail if on product detail page
        loadProductDetail();
        
        function toggleNavbarMethod() {
            if ($(window).width() > 768) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Home page slider
    $('.main-slider').slick({
        autoplay: true,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true
    });
    
    
    // Product Slider 4 Column
    $('.product-slider-4').slick({
        autoplay: true,
        infinite: true,
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    });
    
    
    // Product Slider 3 Column
    $('.product-slider-3').slick({
        autoplay: true,
        infinite: true,
        dots: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    });
    
    
    // Single Product Slider
    $('.product-slider-single').slick({
        infinite: true,
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1
    });
    
    
    // Brand Slider
    $('.brand-slider').slick({
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 1000,
        infinite: true,
        arrows: false,
        dots: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 300,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
    
    
    // Quantity
    $('.qty button').on('click', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });
    
    
    // Shipping address show hide
    $('.checkout #shipto').change(function () {
        if($(this).is(':checked')) {
            $('.checkout .shipping-address').slideDown();
        } else {
            $('.checkout .shipping-address').slideUp();
        }
    });
    
    
    // Payment methods show hide
    $('.checkout .payment-method .custom-control-input').change(function () {
        if ($(this).prop('checked')) {
            var checkbox_id = $(this).attr('id');
            $('.checkout .payment-method .payment-content').slideUp();
            $('#' + checkbox_id + '-show').slideDown();
        }
    });

    // Product Sorting
    $(document).on('click', '#sort-dropdown .dropdown-item', function(e) {
        e.preventDefault();
        const sortType = $(this).text().toLowerCase();
        const $container = $('#products-container');
        let $products = $('.product-item', $container).toArray();
        
        // Sort products based on the selected option
        $products.sort((a, b) => {
            const $a = $(a);
            const $b = $(b);
            
            if (sortType === 'newest') {
                // Sort by date (newest first)
                const dateA = new Date($a.data('date'));
                const dateB = new Date($b.data('date'));
                return dateB - dateA;
            } else if (sortType === 'popular') {
                // Sort by popularity (highest first)
                return $b.data('popularity') - $a.data('popularity');
            }
            return 0;
        });
        
        // Re-append sorted products
        $products.forEach(product => {
            $(product).parent().appendTo($container);
        });
        
        // Update the dropdown text
        $('#sort-dropdown .dropdown-toggle').text(`Sort by ${sortType}`);
        
        // Reinitialize pagination after sorting
        if (typeof showPage === 'function') {
            showPage(1);
        }
    });

    // Product List Pagination & Category Filter
    $(document).ready(function () {
        const productsPerPage = 12;
        let currentCategory = "all";
        let currentPage = 1;

        function getCategoryFromText(text) {
            const map = {
                "all": "all",
                "toys": "toys",
                "stuff-toys": "stuff-toys",
                "decor": "decor",
                "bouquet": "bouquet"
            };
            return map[text.trim().toLowerCase()] || text.trim().toLowerCase();
        }

        function getFilteredProducts() {
            let $allProducts = $('#products-container > div');
            return $allProducts.filter(function () {
                let $item = $(this).find('.product-item');
                let categories = ($item.data('category') || '').toString().toLowerCase().split(' ');
                return currentCategory === "all" || categories.includes(currentCategory);
            });
        }

        function showPage(page) {
            let $allProducts = $('#products-container > div');
            let $filtered = getFilteredProducts();
            let totalPages = Math.ceil($filtered.length / productsPerPage);

            if (page < 1) page = 1;
            if (page > totalPages) page = totalPages;

            $allProducts.hide();
            $filtered.hide();
            $filtered.slice((page - 1) * productsPerPage, page * productsPerPage).show();

            currentPage = page;
            updatePagination(totalPages);
        }

        function updatePagination(totalPages) {
            let $pagination = $('#pagination');
            $pagination.find('.page-number').remove();

            for (let i = 1; i <= totalPages; i++) {
                let $li = $('<li class="page-item page-number"></li>');
                if (i === currentPage) $li.addClass('active');
                $li.append('<a class="page-link" href="#">' + i + '</a>');
                $('#next-page').before($li);
            }

            $('#prev-page').toggleClass('disabled', currentPage === 1);
            $('#next-page').toggleClass('disabled', currentPage === totalPages || totalPages === 0);
        }

        // Category dropdown click
        $(document).on('click', '#category-dropdown .dropdown-item', function (e) {
            e.preventDefault();
            const selectedText = ($(this).text() || '').toString();
            currentCategory = getCategoryFromText(selectedText);
            currentPage = 1;

            // Update dropdown label
            $('#category-dropdown .dropdown-toggle').text(selectedText);

            showPage(currentPage);
        });

        // Pagination click
        $('#pagination').on('click', '.page-number', function (e) {
            e.preventDefault();
            let page = parseInt($(this).text());
            if (!isNaN(page)) {
                showPage(page);
            }
        });
        $('#prev-page').on('click', function (e) {
            e.preventDefault();
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
        });
        $('#next-page').on('click', function (e) {
            e.preventDefault();
            let $filtered = getFilteredProducts();
            let totalPages = Math.ceil($filtered.length / productsPerPage);
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
            }
        });

        // Default category is "All"
        $('#category-dropdown .dropdown-toggle').text('All');
        currentCategory = 'all';
        showPage(1);
    });

})(jQuery);
