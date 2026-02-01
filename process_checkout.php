<?php
header('Content-Type: application/json');
require_once 'config.php';

// Initialize response array
$response = ['success' => false, 'message' => '', 'orderId' => ''];

try {
    // Get JSON input from checkout.js
    $jsonInput = file_get_contents('php://input');
    $orderData = json_decode($jsonInput, true);
    
    // If JSON input is not available, try POST data (for form submissions)
    if (empty($orderData)) {
        // Handle form POST data
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $address = $_POST['address'] ?? '';
        $city = $_POST['city'] ?? '';
        $zip = $_POST['zip'] ?? '';
        $country = $_POST['country'] ?? '';
        
        // Get cart items from POST data
        $cartItems = [];
        if (isset($_POST['cart']) && is_array($_POST['cart'])) {
            $cartItems = $_POST['cart'];
        } else {
            throw new Exception('No cart items found. Please add items to your cart before checking out.');
        }
        
        $total = 0;
        foreach ($cartItems as $item) {
            $total += $item['price'] * $item['quantity'];
        }
    } else {
        $name = $orderData['customer']['name'] ?? '';
        $email = $orderData['customer']['email'] ?? '';
        $phone = $orderData['customer']['phone'] ?? '';
        $address = $orderData['customer']['address'] ?? '';
        $city = '';
        $zip = '';
        $country = '';
        
        $cartItems = $orderData['items'] ?? [];
        
        if (isset($orderData['totals']['grand'])) {
            $total = $orderData['totals']['grand'];
        } else {
            $total = 0;
            foreach ($cartItems as $item) {
                $total += ($item['price'] ?? 0) * ($item['quantity'] ?? 0);
            }
        }
    }
    
    // Basic validation
    if (empty($name) || empty($email) || empty($phone) || empty($address)) {
        throw new Exception('All required fields (name, email, phone, address) must be filled.');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please enter a valid email address.');
    }
    
    if (empty($cartItems)) {
        throw new Exception('No cart items found. Please add items to your cart before checking out.');
    }
    
    // Prepare email content
    $orderNumber = 'ORD-' . strtoupper(uniqid());
    $orderDate = date('F j, Y, g:i a');
    
    // Format address properly
    $fullAddress = htmlspecialchars($address);
    if (!empty($city)) {
        $fullAddress .= ", " . htmlspecialchars($city);
    }
    if (!empty($zip)) {
        $fullAddress .= ", " . htmlspecialchars($zip);
    }
    if (!empty($country)) {
        $fullAddress .= ", " . htmlspecialchars($country);
    }
    
    $emailContent = "
        <h2>New Order #$orderNumber</h2>
        <p><strong>Order Date:</strong> $orderDate</p>
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> " . htmlspecialchars($name) . "<br>
        <strong>Email:</strong> " . htmlspecialchars($email) . "<br>
        <strong>Phone:</strong> " . htmlspecialchars($phone) . "<br>
        <strong>Address:</strong> $fullAddress</p>
        
        <h3>Order Details</h3>
        <table border='1' cellpadding='10' cellspacing='0' style='width:100%; border-collapse: collapse;'>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>";
    
    foreach ($cartItems as $item) {
        $itemPrice = $item['price'] ?? 0;
        $itemQuantity = $item['quantity'] ?? 0;
        $itemName = htmlspecialchars($item['name'] ?? 'Unknown Product');
        $itemTotal = $itemPrice * $itemQuantity;
        $emailContent .= "
            <tr>
                <td>{$itemName}</td>
                <td>{$itemQuantity}</td>
                <td>₨{$itemPrice}</td>
                <td>₨{$itemTotal}</td>
            </tr>";
    }
    
    $emailContent .= "
            <tr>
                <td colspan='3' style='text-align: right;'><strong>Total:</strong></td>
                <td><strong>₨{$total}</strong></td>
            </tr>
        </table>";
    
    // Send email to admin
    $adminSubject = "New Order #$orderNumber - " . SITE_NAME;
    $adminSent = sendEmail(ADMIN_EMAIL, $adminSubject, $emailContent);
    
    // Log email sending status
    error_log("Admin email sent: " . ($adminSent ? 'true' : 'false'));
    if (!$adminSent) {
        error_log("Failed to send admin email. Check SMTP configuration.");
    }
    
    // Send confirmation email to customer with order details
    $customerSubject = "Order Confirmation #$orderNumber - " . SITE_NAME;
    $customerMessage = "
        <h2>Thank you for your order, " . htmlspecialchars($name) . "!</h2>
        <p>We have received your order and will process it shortly.</p>
        <p><strong>Order Number:</strong> $orderNumber</p>
        <p><strong>Order Date:</strong> $orderDate</p>
        
        <h3>Order Summary</h3>
        <table border='1' cellpadding='10' cellspacing='0' style='width:100%; border-collapse: collapse;'>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>";
    
    foreach ($cartItems as $item) {
        $itemPrice = $item['price'] ?? 0;
        $itemQuantity = $item['quantity'] ?? 0;
        $itemName = htmlspecialchars($item['name'] ?? 'Unknown Product');
        $itemTotal = $itemPrice * $itemQuantity;
        $customerMessage .= "
            <tr>
                <td>{$itemName}</td>
                <td>{$itemQuantity}</td>
                <td>₨{$itemPrice}</td>
                <td>₨{$itemTotal}</td>
            </tr>";
    }
    
    $customerMessage .= "
            <tr>
                <td colspan='3' style='text-align: right;'><strong>Grand Total:</strong></td>
                <td><strong>₨{$total}</strong></td>
            </tr>
        </table>
        
        <h3>Shipping Information</h3>
        <p><strong>Name:</strong> " . htmlspecialchars($name) . "<br>
        <strong>Email:</strong> " . htmlspecialchars($email) . "<br>
        <strong>Phone:</strong> " . htmlspecialchars($phone) . "<br>
        <strong>Address:</strong> " . htmlspecialchars($address);
    if (!empty($city)) {
        $customerMessage .= ", " . htmlspecialchars($city);
    }
    if (!empty($zip)) {
        $customerMessage .= ", " . htmlspecialchars($zip);
    }
    if (!empty($country)) {
        $customerMessage .= ", " . htmlspecialchars($country);
    }
    $customerMessage .= "</p>
        
        <p>You can track your order status by replying to this email or contacting our support team.</p>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>" . SITE_NAME . " Team</p>";
    
    $customerSent = sendEmail($email, $customerSubject, $customerMessage);
    
    // Log email sending status
    error_log("Customer email sent: " . ($customerSent ? 'true' : 'false'));
    if (!$customerSent) {
        error_log("Failed to send customer email to: $email. Check SMTP configuration.");
    }
    
    // Return success even if one email fails, but log it
    if ($adminSent || $customerSent) {
        $response['success'] = true;
        $response['message'] = 'Order placed successfully!';
        $response['orderId'] = $orderNumber;
        
        // If JSON request, return JSON response
        if (!empty($jsonInput)) {
            echo json_encode($response);
            exit();
        }
        
        // Otherwise redirect (for form submissions)
        header('Location: thankyou.html?status=order_success&order=' . urlencode($orderNumber));
    } else {
        throw new Exception('Failed to send confirmation email. Please contact support.');
    }
    
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    error_log("Checkout error: " . $e->getMessage());
    
    // If JSON request, return JSON response
    if (!empty($jsonInput)) {
        http_response_code(400);
        echo json_encode($response);
        exit();
    }
    
    // Otherwise redirect (for form submissions)
    header('Location: thankyou.html?status=order_failed&error=' . urlencode($e->getMessage()));
}

exit();
