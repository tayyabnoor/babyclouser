<?php
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

header('Content-Type: application/json');

$baseDir = dirname(__DIR__);
$env = Dotenv::createImmutable($baseDir);
$env->safeLoad();

$adminEmailsRaw = getenv('ADMIN_EMAILS') ?: 'info@bahawalpurfarm.com';
$adminEmails = array_filter(array_map('trim', explode(',', $adminEmailsRaw)));
$to = $adminEmails[0] ?? null;
if (!$to) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'No admin email configured']);
    exit;
}

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
    $mail->addAddress($to);

    $mail->Subject = '[Test] Baby Clouser - ' . date('c');
    $mail->Body = 'This is a test email from your Baby Clouser PHP backend.';
    $mail->AltBody = $mail->Body;

    $mail->send();
    echo json_encode(['ok' => true, 'message' => 'Test email sent', 'to' => $to]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Failed to send test email', 'error' => $e->getMessage()]);
}

?>
