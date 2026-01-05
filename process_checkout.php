<?php
require_once 'config.php';

// Initialize response array
$response = ['success' => false, 'message' => ''];

try {
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    $city = $_POST['city'] ?? '';
    $zip = $_POST['zip'] ?? '';
    $country = $_POST['country'] ?? '';
    
    // Basic validation
    if (empty($name) || empty($email) || empty($phone) || empty($address) || empty($city) || empty($zip) || empty($country)) {
        throw new Exception('All fields are required.');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please enter a valid email address.');
    }
    
    // Get cart items from POST data
    $cartItems = [];
    if (isset($_POST['cart']) && is_array($_POST['cart'])) {
        $cartItems = $_POST['cart'];
    } else {
        throw new Exception('No cart items found. Please add items to your cart before checking out.');
    }
    
    // Calculate total
    $total = 0;
    foreach ($cartItems as $item) {
        $total += $item['price'] * $item['quantity'];
    }
    
    // Prepare email content
    $orderNumber = 'ORD-' . strtoupper(uniqid());
    $orderDate = date('F j, Y, g:i a');
    
    $emailContent = "
        <h2>New Order #$orderNumber</h2>
        <p><strong>Order Date:</strong> $orderDate</p>
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> $name<br>
        <strong>Email:</strong> $email<br>
        <strong>Phone:</strong> $phone<br>
        <strong>Address:</strong> $address, $city, $zip, $country</p>
        
        <h3>Order Details</h3>
        <table border='1' cellpadding='10' cellspacing='0' style='width:100%; border-collapse: collapse;'>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>";
    
    foreach ($cartItems as $item) {
        $itemTotal = $item['price'] * $item['quantity'];
        $emailContent .= "
            <tr>
                <td>{$item['name']}</td>
                <td>{$item['quantity']}</td>
                <td>$$item['price']</td>
                <td>$$itemTotal</td>
            </tr>";
    }
    
    $emailContent .= "
            <tr>
                <td colspan='3' style='text-align: right;'><strong>Total:</strong></td>
                <td><strong>$$total</strong></td>
            </tr>
        </table>";
    
    // Send email to admin
    $adminSubject = "New Order #$orderNumber - " . SITE_NAME;
    $adminSent = sendEmail(ADMIN_EMAIL, $adminSubject, $emailContent);
    
    // Log email sending status
    error_log("Admin email sent: " . ($adminSent ? 'true' : 'false'));
    
    // Send confirmation email to customer
    $customerSubject = "Order Confirmation #$orderNumber - " . SITE_NAME;
    $customerMessage = "
        <p>Dear $name,</p>
        <p>Thank you for your order! We have received your order and will process it shortly.</p>
        <p><strong>Order Number:</strong> $orderNumber</p>
        <p>You can track your order status by replying to this email or contacting our support team.</p>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>" . SITE_NAME . " Team</p>";
    
    $customerSent = sendEmail($email, $customerSubject, $customerMessage);
    
    // Log email sending status
    error_log("Customer email sent: " . ($customerSent ? 'true' : 'false'));
    
    if ($adminSent && $customerSent) {
        // Clear the cart (implement this function based on your cart system)
        // clearCart();
        
        $response['success'] = true;
        $response['message'] = 'Order placed successfully!';
        header('Location: thankyou.html?status=order_success');
    } else {
        throw new Exception('Failed to send confirmation email. Please contact support.');
    }
    
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    header('Location: thankyou.html?status=order_failed&error=' . urlencode($e->getMessage()));
}

exit();
