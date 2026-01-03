<?php
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

header('Content-Type: application/json');

$baseDir = dirname(__DIR__);
$env = Dotenv::createImmutable($baseDir);
$env->safeLoad();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input) || empty($input['customer']) || empty($input['items']) || empty($input['totals'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid order data']);
    exit;
}

$orderId = 'ORD-' . time();
$ordersDir = $baseDir . '/orders';
if (!is_dir($ordersDir)) mkdir($ordersDir, 0755, true);
$orderFile = $ordersDir . '/' . $orderId . '.json';
file_put_contents($orderFile, json_encode(array_merge(['id' => $orderId], $input), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// build order details text
function build_order_text($order) {
    $t = "Order Placed: " . date('c', strtotime($order['timestamp'] ?? date('c')) ) . "\n\n";
    $c = $order['customer'];
    $t .= "CUSTOMER INFORMATION:\n";
    $t .= "- Name: " . ($c['name'] ?? '') . "\n";
    $t .= "- Email: " . ($c['email'] ?? '') . "\n";
    $t .= "- Phone: " . ($c['phone'] ?? '') . "\n";
    $t .= "- Address: " . ($c['address'] ?? '') . "\n\n";
    $t .= "ORDER ITEMS:\n";
    foreach ($order['items'] as $i => $item) {
        $t .= ($i + 1) . ". " . ($item['name'] ?? '') . "\n";
        $t .= "   Quantity: " . ($item['quantity'] ?? 0) . "\n";
        $t .= "   Price: " . ($item['price'] ?? 0) . "\n";
        $t .= "   Subtotal: " . (($item['price'] ?? 0) * ($item['quantity'] ?? 0)) . "\n";
    }
    $t .= "\nORDER TOTALS:\n";
    $tot = $order['totals'];
    $t .= "- Subtotal: " . ($tot['subtotal'] ?? 0) . "\n";
    $t .= "- Delivery: " . ($tot['delivery'] ?? 0) . "\n";
    $t .= "- Grand Total: " . ($tot['grand'] ?? 0) . "\n";
    return $t;
}

$orderDetails = build_order_text(array_merge(['timestamp' => date('c')], $input));

// send email to admin(s)
$adminEmailsRaw = getenv('ADMIN_EMAILS') ?: 'info@bahawalpurfarm.com';
$adminEmails = array_filter(array_map('trim', explode(',', $adminEmailsRaw)));

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST') ?: getenv('EMAIL_HOST');
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USER') ?: getenv('EMAIL_USER');
    $mail->Password = getenv('SMTP_PASS') ?: getenv('EMAIL_PASSWORD');
    $mail->SMTPSecure = getenv('SMTP_SECURE') ?: 'tls';
    $mail->Port = intval(getenv('SMTP_PORT') ?: 587);

    $from = getenv('FROM_EMAIL') ?: ($mail->Username ?: 'no-reply@example.com');
    $mail->setFrom($from, getenv('FROM_NAME') ?: 'Baby Clouser');
    foreach ($adminEmails as $a) $mail->addAddress($a);

    $mail->Subject = "New Order #{$orderId} from " . ($input['customer']['name'] ?? 'Customer');
    $mail->Body = "New order received!\n\n" . $orderDetails;
    $mail->AltBody = $mail->Body;
    $mail->isHTML(true);
    $mail->Body = '<h2>New Order #' . $orderId . '</h2><pre style="font-family: monospace; white-space: pre-wrap;">' . htmlspecialchars($orderDetails) . '</pre>';

    $mail->send();
} catch (Exception $e) {
    error_log('Mail send error: ' . $e->getMessage());
}

echo json_encode(['ok' => true, 'message' => 'Order received', 'orderId' => $orderId]);

?>
